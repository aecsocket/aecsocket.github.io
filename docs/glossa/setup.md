---
sidebar_position: 1
---

# Setup

:::tip

Find the current version [here](https://github.com/aecsocket/glossa).

:::

## Gradle - Kotlin DSL - Version catalog

`gradle/libs.version.toml`

```toml
[versions]
glossa = "[VERSION]"

[libraries]
glossa = { group = "com.github.aecsocket", name = "glossa-[MODULE]", version.ref = "glossa" }
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
* `glossa-adventure`
