---
sidebar_position: 3
---

# Commands

Admin commands for modifying the physics state.

Rattle exports a single command, `/rattle`, which manages all the state of the mod.
It has several subcommands for specific functions, and all permission nodes for commands
follow the same format, starting with `rattle.command.`, and usually followed by the full
path to that command. This prefix will be omitted and replaced with a single leading `.`.

## `space`

- `<world>` - the world to manipulate
  - `create` - creates a world physics object for a world, if it does not already exist

    Permission: `.space.create`

  - `destroy` - destroys a world physics object, and all associated data
    
    Permission: `.space.destroy`

## `stats`

- displays statistics gathered in the last few seconds on how the engine is performing
- `<enabled>` - optional; if you are a player, enables or disables a "stats boss-bar" display
  which shows a shorter form of the stats in real-time

## `launcher`

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

TODO!
