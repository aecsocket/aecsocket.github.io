---
sidebar_position: 1
---

# Installation

How to install the mod.

## Environment

After having downloaded the correct mod file for your platform (see [Platforms](../../platforms/)),
you will need to set up your server environment to run the mod correctly.

**On a standard server setup, the mod probably will not work, and will crash on startup!**

### Java

Due to the project using the Java 19 preview FFI API, you will need **exactly** Java 19 to run this.
Not any lower or higher version. This will eventually be bumped, probably to 21, but at the time of
writing, you will need Java 19.

### Startup flags

This will depend on what environment you are running the mod on. For a client-side mod, this should
just work, however if you are running this on the server side, you will need to add these startup
flags to your server:

```sh
--enable-preview --enable-native-access=ALL-UNNAMED
```

Where exactly to add these flags will depend on your server provider. See their documentation for
more details.
