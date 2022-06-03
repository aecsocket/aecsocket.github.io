---
sidebar_position: 2
---

# Configurate

Loading data into I18N builders using Configurate nodes.

## I18NLoader

This class contains static methods to load translation data from Configurate's `ConfigurationNodes`.
These mthods will throw `SerializationException` if an error occurs.

## Serializers

Before loading your nodes, register the Glossa serializers by adding `I18NSerializers.ALL` to your
config options' serializers.

## Translations

Use `loadTranslations` to load a `List<Translation.Root>` which can be registered into an `I18N.Builder`:

```kotlin
val node = // HoconConfigurationLoader.(...)

StringI18NBuilder(english).apply {
  I18NLoader.loadTranslations(node).forEach(this::register)
}
```

```json5
"en-US": {
  hud: {
    health: "Health: ..."
    money: "Money: ..."
    inventory: {
      carrying: "Carrying weight: ..."
      carry_max: "Max carrying weight: ..."
    }
  }
  notification: {
    overencumbered: [
      "You are carrying too much!"
      "Drop some items."
    ]
  }
}

"de-DE": {
  hud: {
    health: "Health: ..."
  }
}

// `root` translations will always be the last fallback
"root": {
  notification: {
    prefix: "[!] "
  }
}
```

## Styles and formats

Use:
* `loadStyles` : `Map<String, Style>`
* `loadFormats` : `Map<List<String>, I18NFormat>`
  
which can be registered into an `AdventureI18NBuilder`:

```kotlin
AdventureI18NBuilder(english).apply {
  I18NLoader.loadStyles(nodeStyles).forEach(this::registerStyle)
  I18NLoader.loadFormats(nodeFormats).forEach(this::registerFormat)
}
```

```json5
styles: {
  variable: { color: "yellow" }
  error: { color: "red", bold: true }
}

formats: {
  "error": "error"
  "error.timeout": { time: "variable" }
}
```

## Load all

Use `loadAll` to load a full set of:
* `List<Translation.Root>`
* `Map<String, Style>`
* `Map<List<String>, I18NFormat>`

```kotlin
AdventureI18NBuilder(english).apply {
  val (translations, styles, formats) = I18NLoader.loadAll(node)
  translations.forEach(this::register)
  styles.forEach(this::registerStyle)
  formats.forEach(this::registerFormat)
}
```
