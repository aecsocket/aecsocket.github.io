---
sidebar_position: 3
---

# Rattle

Generic physics engine framework for Minecraft servers

### [GitHub](https://github.com/aecsocket/rattle) · [Docs](https://aecsocket.github.io/rattle) · [Dokka](https://aecsocket.github.io/rattle/dokka)

Rattle is an project which integrates a fully-featured physics engine into a server-side game environment,
and exposes an ergonomic and user-friendly API for interacting with the physics state. The integration
includes having the world state (such as blocks and entities) influence the physics state (i.e. blocks in
the terrain can be collided against), and allow that physics state to be displayed to vanilla clients via
techniques such as display entities - no mods required!

This project currently uses the [Rapier](https://rapier.rs) physics engine backend, with Java bindings
provided via [rapier-ffi/rapier-java](https://github.com/aecsocket/rapier-ffi/tree/main/rapier-java), and
integrated as a Rattle backend in the `rattle-rapier` module.

**This project requires Java 19 *exactly*, and the `--enable-preview --enable-native-access=ALL-UNNAMED` flags
must be set!** See the installation guides for more detail.

## Getting started

Note: The terms mod and plugin are used interchangeably in these documents.

### [Supported platforms and installation guides](./platforms/)

### [For users](./guide/user/)

### [For developers](./guide/dev/)
