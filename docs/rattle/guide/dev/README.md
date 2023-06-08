---
sidebar_position: 3
---

# Developer guide

Before starting, make sure you have read [Architecture](../architecture.md).

## Dependency

Currently the Maven artifacts are not published to any online repo. I'll get them up at some point.

Modules:
- `rattle-api` - core API classes and utilities
- `rattle-rapier` - Rapier implementation of the API
- `rattle-common` - common tools for implementing Rattle into a platform
  - `rattle-paper` - Paper platform implementation
  - `rattle-fabric` - Fabric platform implementation

See the latest version on the GitHub page.

```kotlin
dependencies {
    implementation("io.github.aecsocket", rattleModule, rattleVersion)
}
```

## Language

Rattle is written in Kotlin, however it maintains full Java compatibility - the API will just
be slightly less ergonomic. Note that Kotlin docs may not be available when working from Java -
this should be resolved in the future. Or not.

## Platform

If using a platform, your entry point to Rattle will depend on the platform.
See [Platforms](../../platforms/) for details.

## Documentation

The API is heavily documented, and is the easiest place to find development info since it's
also integrated into your IDE. I plan to write small snippets here as well on how to combine
the different parts of the API together.
