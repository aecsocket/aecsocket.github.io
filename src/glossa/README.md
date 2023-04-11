# Glossa

[GitHub](https://github.com/aecsocket/glossa)

Glossa provides a simple and opinionated API for developers to create localizable versions of their software,
and provides server admins and translators with tools to create translations based on powerful and useful
features like the MiniMessage format and Unicode ICU templates. It is designed for Kotlin, with minimal support
for Java.

## Motivation

There already exist several methods of localizing plugins based on Adventure:
- MiniMessage provides an easy format for parsing components from text
- Resource bundles can be used for internal translations
- The `config.yml` can be used for user-customisable translations
- External libraries such as [moonshine](https://github.com/kyoripowered/moonshine) can be used

However, Glossa takes the advantages of all of these methods and combines them into a simple and opinionated
framework for translations. It also separates text strings from styling, allowing translators to only worry about
the text, and allowing styling changes to not require modifying all existing translation files.

## Getting started

For users, see the [Format](format.md) page.

For developers, see the [API](api.md) page.
