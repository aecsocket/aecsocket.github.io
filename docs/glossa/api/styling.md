---
sidebar_position: 2
---

# Styling

Using the styling features.

## I18N

Styling features are only supported on the `StylingI18N`, available from the `glossa-adventure` module.

## Loading from an external source

Similar to translations, you can load styles and formats from a `ConfigurationLoader`:

```kt
i18n.loadTranslations(HoconConfigurationLoader.builder()
  .source { BufferedReader(StringReader("""
    "message.status": "Health: @<health>[{_, number}] | Hunger: @<hunger>[{_, number}]"
  """.trimIndent())) }
  .build())

i18n.loadStyling(HoconConfigurationLoader.builder()
  .source { BufferedReader(StringReader("""
    styles: {
      info: { color: "white" }
      variable: { color: "yellow" }
    }
    formats: {
      "message.status": {
        __default__: "info"
        "health": "variable"
        "hunger": "variable"
      }
    }
  """.trimIndent())) }
  .build())

i18n["message.status", argMap(
  "health" arg {15},
  "hunger" arg {5}
)]
// -> [ (WHITE "Health: ", YELLOW "15", WHITE " | Hunger: ", YELLOW "5") ]
```

To load from a file:

```kt
val file = File("formats.conf")
val path = Path("formats.conf")

i18n.loadStyling(HoconConfigurationLoader.builder()
  // you can use either one of:
  .file(file)
  .path(path)
  
  .build())
```
