---
sidebar_position: 1
---

# Architecture

An explanation of the concepts and design of the project.

Here is a brief overview of the terminology and concepts used in the project - if you need more
detailed explanations on the various concepts, see their respective pages in the dev guide.

## Physics engine

Rattle is simply a frontend, or wrapper, around an existing physics engine - this engine is called
the "backend". The current backend and technologies used are:
- [Rapier](https://rapier.rs) - a physics engine written in Rust
- [rapier-ffi/rapier-ffi](https://github.com/aecsocket/rapier-ffi/tree/main/rapier-ffi) - C bindings for the Rust engine
- [rapier-ffi/rapier-java](https://github.com/aecsocket/rapier-ffi/tree/main/rapier-java) - Java bindings for the C bindings
- `rattle-api` - the frontend exposed to developers for communicating with the physics engine
- The platform implementations of Rattle

Since the backend is not written in Java, it is referred to as a "native library" - as in, it is
managed by the native operating system, not the JVM (Java).

The engine's job is to create and manage resources that are required by the native libraries, such
as physics spaces and rigid bodies.

## Geometry

A geometry is a raw, user-created version of a shape with volume in the world. Some examples of
geometries are spheres or boxes. Geometries do not store any info on where they are in the world;
they only store local data. By itself, a geometry cannot be used for physics simulations, however
can be baked into a *shape*.

## Shape

A shape is a baked (converted) form of a *geometry* which can be used for physics. You can **not**
get a geometry back from a shape. These also do not store info on where they are in the world,
and may be somewhat expensive to compute (e.g. if doing a more complex operation like making a
convex hull or convex decomposition). So it is best to cache these and reuse them as much as
possible.

## Physics space

All physics simulation happens inside of a physics space. There can be multiple physics spaces
active at once, but they cannot share any physics state like *rigid bodies* (data is OK though,
like *shapes*).

## Collider

A collider is an object owned by a physics space which has a *shape* and position in the world,
and allows other colliders to be affected by it - this means it can push them away via forces
and impulses, the typical classical mechanics effects. However, a collider cannot move by itself -
it has no concept of a velocity (linear or angular). Instead, this is done by *rigid bodies*.

## Rigid body

A rigid body is an object that simulates Newtonian dynamics such as velocity, forces, and impulses.
Although a collider may apply forces to other objects, a rigid body is the object that actually
uses those forces to be pushed away, spun, etc. Zero or more colliders may be attached to a rigid
body, in which case the collider effectively follows the body as it moves.
Rigid bodies may be:
- fixed - the body does not move by itself
- dynamic - the physics engine simulates forces and dynamics for themselves
- kinematic - the user defines what position the body moves to, and the engine calculates the
  velocities for that

## Joint

A joint is a constraint that can be applied by a user to a physics space, which ensures that two
rigid bodies keep some sort of positional relationship to each other - it ensures that the
constraint is "solved". For example, a door may be modelled by a joint which locks the translation
of a body (not allowing it to move), but keeps a single "hinge" axis free for rotation
(allowing it to swing, but only on one axis). Limits could further be applied to these axis to
allow it to only swing a certain amount.

### Impulse joints

An impulse joint applies impulses to try to solve its constraint. This means that they
are fast to compute, and they are flexible, allowing loops in the graph of all joints in the space.
However, they do not resolve constraints perfectly - there is often error in the position.
This is fine for most applications, but not all.

### Multibody joints

A multibody joint works in reduced coordinates, forming a tree of multibodies in the physics space
which resolve their positions all at once. This means that they work slower, however are
guaranteed to perfectly resolve constraints (as long as the constraints themselves are valid).

## World physics

When working with a server environment, each world loaded in the game will have up to one
physics space assigned to it. This handles all physics for this world, and can be manipulated
using commands and through the API.

Developer note: this is one of the most crucial parts of the API, however there are some safety
guarantees you must uphold when working with one! See the corresponding dev guide page to
see more.

### Terrain strategy

To allow blocks in the world to be collidable, we use a terrain strategy. The current terrain
strategy is a "dynamic terrain" implementation, which creates collision on-the-fly as bodies
require collision with chunks in the world.

### Entity strategy

To allow entities in the world to be collidable, we use an entity strategy. The default
implementation simply assigns a rigid body to entities, and moves the body around as the entity
also moves.
