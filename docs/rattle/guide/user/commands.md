---
sidebar_position: 3
---

# Commands

Admin commands for modifying the physics state.

Rattle exports a single command, `/rattle`, which manages all the state of the mod.
It has several subcommands for specific functions, and all permission nodes for commands
follow the same format, starting with `rattle.command.`, and usually followed by the full
path to that command. This prefix will be omitted and replaced with a single leading dot (`.`).

**Note: at some point, this documentation may be merged into the in-game command documentation
instead. This would make it easier to maintain and keep up-to-date.**

## `/rattle space`

- `<world>` - the world to manipulate
  - `create` - creates a world physics object for a world, if it does not already exist

    Permission: `.space.create`

  - `destroy` - destroys a world physics object, and all associated data
    
    Permission: `.space.destroy`

## `/rattle body`

Manages the state of "simple bodies" in the world - that is, lightweight debug bodies which
are automatically rendered to players.

### `create`

Creates one or more of these simple bodies.

Permission: `.body.create`

- `<location>` - the center around which to spawn bodies
- `--count`, `-n` - the number of bodies to create, default `1.0`
- `--spread`, `-s` - the half-extent in which bodies will be randomly positioned around `location`,
  default `0.0` (the algorithm spawns bodies within a cube, half-side length `spread`)
- `--density`, `-d` - the physical density of a body, default `1.0`
  (automatically computes mass)
- `--mass`, `-m` - the physical mass of a body, default computed by density
  (automatically computes density)
- `--friction` - the friction coefficient of the collider, default `0.5`
- `--restitution` - the restitution coefficient of the collider, default `0.0`
- `--virtual`, `-v` - if specified, no displayed render will be created - the body will be
  simulated but not drawn
  - `fixed` - the bodies created will be fixed (not moving)
    - `sphere`
      - `radius` - radius of the sphere
    - `box`
      - `half-extent` - half-lengths of the sides of the box
  - `dynamic` - the bodies created will be dynamic (moving)
    - `--ccd` - if specified, this body will have CCD enabled
    - `--gravity-scale`, `-g` - a multiplier for the gravity acceleration applied, default `1.0`
    - (...)

### `destroy`

Destroys simple bodies.

Permission: `.body.destroy`

- `<world>` - the world in which to destroy bodies
  - `all` - destroy all bodies

## `/rattle stats`

Permission: `.stats`

- displays statistics gathered in the last few seconds on how the engine is performing
- `<enabled>` - optional; if you are a player, enables or disables a "stats boss-bar" display
  which shows a shorter form of the stats in real-time

## `/rattle launcher`

Permission: `.launcher`

- if no arguments are specified, disables the launcher; otherwise, if you are a player...
- `sphere` - you can launch spherical rigid bodies by left-clicking
  - `radius` - radius of the sphere
- `box` - you can launch box-shaped rigid bodies by left-clicking
  - `half-extent` - half-lengths of the sides of the box
- `--friction` - the friction coefficient of the body (min 0)
- `--restitution` - the restitution coefficient of the body (min 0)
- `--velocity`, `-v` - the initial magnitude of linear velocity (speed) of the body as it is launched
- `--density`, `-d` - density of the collider for that body
- `--no-ccd` - disables continuous collision detection
  
  Note: this is automatically enabled because you will typically be launching bodies at high speeds
  with this tool, because it's fun. So to disable CCD, you must explicitly mark it as such.
