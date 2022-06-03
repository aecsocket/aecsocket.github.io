---
sidebar_position: 2
---

# API

How to use the developer API.

## Setup

First of all, you must set up Glossa in your development environment.

This example uses **Gradle - Kotlin DSL - Version catalog**.

:::tip

Find the current version [here](https://github.com/aecsocket/glossa).

:::

`gradle/libs.version.toml`

```toml
[versions]
glossa = "[VERSION]"

[libraries]
glossa = { group = "com.github.aecsocket.glossa", name = "glossa-[MODULE]", version.ref = "glossa" }
```

`build.gradle.kts`

```kt
repositories {
    maven("https://jitpack.io")
}

dependencies {
    implementation(libs.glossa)
}
```

### Modules

* `glossa-core`
* `glossa-adventure` (incl. `-core`)
* `glossa-configurate` (incl. `-core`, `-adventure`)
