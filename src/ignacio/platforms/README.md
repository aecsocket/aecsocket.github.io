# Platforms

Ignacio runs on the following platforms:
- [Paper](./paper.md)

There are several features present on all platforms:

## World-to-space

Each world on the server may have up to a single `PhysicsWorld` present for the entire world.
A `PhysicsWorld` stores a `PhysicsSpace`, as well as some extra logic for integrating the physics into the world.
These spaces are updated automatically by the server, using the default settings as specified in the settings file.
Physics processing mainly runs on a set of threads which are separate from the main server thread(s),
therefore during heavy physics load, the main server logic will not be heavily affected, and vice-versa.

A `PhysicsWorld` can be obtained from a world by calling `Ignacio.worlds[world]`, returning a space if it already exists.
To create one if it does not exist, call `Ignacio.worlds.getOrCreate(world)`.
To obtain the physics space from a world, either access `PhysicsWorld.space` or use destructuring syntax:

```kotlin
val (physics) = Ignacio.worlds.getOrCreate(world)
// physics: PhysicsSpace
```

## Terrain strategy

An implementation of `TerrainStrategy` must be provided for all physics worlds.
This can either be a no-op implementation (`NoOpTerrainStrategy`), or a proper implementation.
From this object, you can query how the physics space interacts with blocks in the world (terrain).

### Moving slice strategy

The default strategy is `MovingSliceTerrainStrategy`, which generates bodies for blocks on-the-fly based active moving bodies
in the physics space.

- Each 16 x *h* x 16 chunk is split into 16 x 16 x 16 chunk slices
- Each physics step (step listener), all chunk slices "near" all active bodies are recorded
- On the next chunk tick for each slice, a snapshot of the chunk is made and stored for processing later
- On the next physics pre-step (before `.update()`):
  - each snapshot is converted to an actual static body and added to the world
  - all slices which were present last step but not this step are removed

- When a block is modified, if a body exists for that block's chunk slice, a snapshot is made of the slice
  - If no slice exists, nothing happens
- The snapshot is stored for processing later, in a similar sequence as above

Note that there may be discrepancies between the shape of the terrain body and the actual blocks, 
if some block updates were not received.
This is automatically fixed once all bodies exit that chunk slice, and then a body enters it again.

Fluid buoyancy is planned, but not implemented yet.

## Entity strategy

Similar to the terrain strategy, an entity strategy manages how entities in the world are mapped to the physics state.
This can either be a no-op implementation (`NoOpEntityStrategy`), or a proper implementation.

### Default strategy

The default strategy is `DefaultEntityStrategy`, which maps each entity to a physics body with a shape corresponding to its
hitbox bounds. Players get a capsule shape instead.

Players in spectator mode have their bodies automatically disable collision response, so they do not collide with other bodies.
