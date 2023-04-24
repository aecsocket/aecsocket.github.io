---
sidebar_position: 1
---

# API

## Entry point

The entry point of the library is an `IgnacioEngine` instance, which manages all resources held by the physics engine.
The underlying physics engine may change, however the currently supported engine is [Jolt](https://github.com/jrouwe/JoltPhysics),
implemented in the module `ignacio-jolt`.
Documentation for the engine can be [found here](https://jrouwe.github.io/JoltPhysics).

To obtain one:
- If using a platform implementation like `ignacio-paper`, use the property `IgnacioAPI.engine`
- If creating your own engine, use the implementation-specific construction strategy
  - For `ignacio-jolt`, use `JoltEngine.builder()`

## Lifecycle

Many objects in Ignacio implement `Destroyable`, meaning their lifecycle must be managed explicitly by the programmer -
that is, they represent a handle to a native object which must be freed after used.
Ignacio will **not** automatically destroy objects; you must call `Destroyable.destroy()` yourself,
taking care to never call it more than once (double-free)!

## Math

Ignacio uses the [Klam](https://github.com/aecsocket/klam) Kotlin linear algebra library, which exposes classes such as
vectors and matrices. The important ones are:
- `FVec3`: 3-dimensional single-precision floating-point vector
  - Used in most vector calculations e.g. local axes, forces, torque
- `DVec3`: 3-dimensional double-precision floating-point vector
  - Used in vector calculations which involve absolute positions in a world, e.g. a body's position
- `FQuat`: single-precision quaternion
  - Used to represent rotations - note that these **are not** Euler angles (e.g. pitch/yaw/roll)!
- `FMat3`: 3x3 single-precision matrix
  - Used to represent e.g. local transforms, inertia matrices
- `DAffine3`: 3-dimensional affine transform, with a double-precision position component and single-precision rotation component
  - Used to represent transforms in world space

## Physics spaces

You can create a `PhysicsSpace` using `IgnacioEngine.space()`, which is a container for an independent world with its own
physics state. You can interact with the space state using various properties:
- create/add/remove bodies using `bodies`
- create/add/remove constraints using `constraints`
- query the state using `broadQuery` and `narrowQuery`

Your application's main update loop will also include calls to `PhysicsSpace.update()` to step the simulation forward in time.
If you are accessing a default physics space managed by a platform (e.g. the space for `world_nether` in `ignacio-paper`), the
physics space is stepped automatically.

You can add a function to run every time the physics space is updated via `PhysicsSpace.onStep()`, and remove it with
`PhysicsSpace.removeStepListener()`. This is useful when syncing body state between your other application threads and the
physics threads. More detail in the Threading section.

## Physics bodies

You can create a `PhysicsBody` using `PhysicsSpace.bodies.create[Static|Moving]()`, describing the body using an implementation
of `BodyDescriptor`. Note that creating a body is not the same as adding it (created bodies are not automatically added), and
removing a body is not the same as destroying it (you can still add back a removed body, but you can't add a destroyed body).

### `StaticBodyDescriptor`

A static body is never active and never moves, but can still apply collision response to moving bodies. This should be used
for level geometry.

### `MovingBodyDescriptor`

A moving body can move, either dynamically or kinematically.
- A dynamic body means it is moved by impulses, forces, constraints, etc.
  - It responds to collisions with other dynamic and kinematic bodies
  - Use `.applyForce`, `.applyImpulse`, `.applyTorque`, `.applyAngularImpulse`
- A kinematic body means it is moved **only** by setting its velocity through the API
  - Its position is not affected by any other bodies, but it can still affect dynamic bodies
  - Use `.moveTo()` to move the body to a desired position and rotation

### Body access

A `PhysicsBody` on its own does not allow you to read or write its properties, such as position or rotation.
Instead, you must lock the body, either for reading or writing.
This allows thread-safe access to bodies,and can be performed by calling `PhysicsBody.read` or `PhysicsBody.write`,
passing a function to run with the resulting `PhysicsBody.Read` or `PhysicsBody.Write` interface.
You can also use `readUnlocked` or `writeUnlocked` in situations when you have already locked this body,
however you must be **very careful** about proper locking here.

Use `writeUnlocked` when:
- this thread has already previously locked this body **for writing**
Use `readUnlocked` when:
- this thread has already previously locked this body **for reading**, or
- you are running code in a step listener
Use the non-unlocked variants when:
- you are doing anything else

You can also use the extension methods `readAs<T : PhysicsBody.Read>` and `writeAs<T : PhysicsBody.Write>` to run the block
if the resulting body access is of type `T`, when e.g. dealing with a property that only exists on moving bodies. Similar
variants exist for the `Unlocked` semantics.

### Body properties

Bodies store their position in the world as a `DVec3` and rotation as an `FQuat`.

## Shapes

All bodies have an associated `Shape`, which is the baked, non-serializable and physics-ready form of a geometrical shape used
for collision detection. Shapes are a managed resource (`Destroyable`), and can be created using `IgnacioEngine.shape()`, passing
an implementation of `ShapeDescriptor`. The available shape types, in order of complexity, are:

- `ConvexDescriptor` - shapes defined to always be convex, centered around (0, 0, 0) unless specified otherwise
  - `SphereDescriptor` - a sphere with a radius
  - `BoxDescriptor` - a box with a vector of half-extents
  - `CapsuleDescriptor` - a capsule
  - `TaperedCapsuleDescriptor` - a capsule with different top and bottom radii
  - `CylinderDescriptor` - a cylinder with flat ends (this is not a stable shape; use another type if possible)
- `CompoundDescriptor` - shapes consisting of one or more child shapes
  - `StaticCompoundDescriptor` - a compound shape which cannot be modified after creation

You should opt for the shape type that is simplest but still accurate enough for your use-case. Don't aim to replicate your visual
model's shape in a collision shape - that will lead to terrible performance.

## Constraints

You can constrain the motion of one or more bodies according to a constraint type, to simulate things like a door on a hinge
or an object sliding along a track.
A body can either be constrained to another body (dynamic or kinematic), or the world itself (`ConstraintTarget.World`).
Only dynamic bodies will be affected by the forces that a constraint applies, and the constraint may not perfectly resolve
the constraint initially (but over time it will approach a solution).

A body may restrict certain **degrees of freedom**.

You can create constraints in a physics space using `PhysicsSpace.constraints.create()`. The same create/destroy/add/remove
semantics as bodies apply to constraints - you can add/remove them as many times as you want, but you can only create or
destroy a specific constraint once.

The available constraint types are:
- `JointDescriptor` - constraints between two bodies, forming a joint
  - `FixedJointDescriptor` - attaches one body to another without any degrees of freedom.
  - TODO

## Layers

## Filters

## Threading

Implementation details vary by engine, however for the current standard (Jolt):

A `2^n` sized array of mutexes is stored for the physics space, with each mutex locking a set of bodies in that space. 
To read or write properties of a body, the body must first be locked with the proper permission, either reading or writing.
This is done by using the read/write methods as described in the body access section.
Note that Jolt automatically locks all bodies during the update step, so your threads will block while waiting for the
update to complete, if it is updating while you try to access a body.
This means that if you are running code in a step listener, you should use `readUnlocked`, but you **must not** use
`writeUnlocked`, since bodies are locked only for reading during the time that the step listeners run.

## See also

- https://jrouwe.github.io/JoltPhysics/
