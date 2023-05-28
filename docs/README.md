---
sidebar_position: 1
---

# Hi

I'm a hobbyist programmer from the UK, who programs in:
- Java and Kotlin - experienced
- Rust - beginner
- JavaScript, TypeScript, Python - familiarity

Some of my work:

## [Skytale](https://skytale.fr/)

Skytale is a French studio developing games and events for Minecraft, with notable examples such as:

- [City of Nations](https://www.youtube.com/watch?v=X3CISdeY3z4)

  An event ran during August 2021 involving streamers from five different countries, where the goal was to collect points through various minigames and come out on top.

- [Children of Steel](https://twitter.com/SkytaleFr/status/1642787653253775361)

  A charity project run by Skytale, raising EUR 17,000 during an event with peak 50,000 concurrent viewers on Twitch. The minigame consisted of farming and collecting materials, involving special items and equipment implemented into the game.

- [The Last Artifact](https://bit.ly/TheLastArtifact)

  An in-development fantasy adventure game focusing on storyline, combat, and inter-player interaction, with a large array of characters, music, and voice-acting, all accessible under a vanilla client.

I have collaborated with the development team on designing tools, such as the Skytale Map Editor; most notably the physics backend used by the 3D editor, called Rattle.
Through this project I have demonstrated the ability to work with other developers through
pre-planning, such as drafting API using UML diagrams, as well as accepting feedback and
changes on various aspects of the code.

## [Rattle](https://github.com/aecsocket/rattle)

*(formerly Ignacio)*

![Rattle screenshot](https://raw.githubusercontent.com/aecsocket/rattle/main/static/banner.png)

An integration of a 3D rigid body physics engine into a Minecraft server-side environment,
allowing simulating physics without requiring clients to download any mods.
This physics integration allows collisions and realistic interactions between rigid bodies, with respect to the Minecraft environment including blocks and entities.

This project taught me:
- interacting with a physics engine: rigid bodies, constraints and joints, broad/narrow phase
- creating bindings for native libraries to Java: combining C++/Rust with the JVM
- developing Java bindings to native libraries; `jolt-java` and `rattle-java`
- performance optimisations through multithreading (including Folia) and concurrent processing

### Examples

The physics engine in action, with the Skytale Map Editor's 3D Model Workspace frontend:

[Video](https://drive.google.com/file/d/15j_tUEzXC3pIvWjGXOW0-29ik_aI0vLg/view)

The physics engine handling 6000 simultaneous rigid bodies, colliding against the terrain:

[Video](https://cdn.discordapp.com/attachments/1000071437446557828/1083834647244443698/2023-03-10_19-29-45.mp4)

Rigid body buoyancy in water:

[Video](https://cdn.discordapp.com/attachments/1000071437446557828/1082394867877027990/2023-03-06_20-08-51.mp4)

## [Sokol](https://github.com/aecsocket/sokol)

![Sokol screenshot showing a decomposed pistol](/img/sokol.png)

An implementation of an entity-component-system framework into Minecraft, which allows server owners
to configure their own items using a composable structure.

This project taught me:
- working with server internals to improve performance
- creating a scalable and maintainable framework
- simple 3D modelling skills for the physical items in the world

### Examples

Attaching and detaching components on a part tree:

[Video](https://cdn.discordapp.com/attachments/809545187810213988/1066742449390768289/2023-01-22_15-32-36.mp4)

An independent laser pointer part attached to a parent part:

![An independent laser pointer part attached to a parent part](https://cdn.discordapp.com/attachments/809545187810213988/1066796826403020850/2023-01-22_19-09-22.png)

## [Glossa](https://github.com/aecsocket/glossa)

A simple and opinionated localization library for Adventure text components, with
features for specialized translation features like plurals, number and date formatting.

This project taught me:
- designing an approachable and stable API
- publishing a Java library to Maven Central

See the sidebar for documentation on my various projects!
