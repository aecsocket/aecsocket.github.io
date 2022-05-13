---
sidebar_position: 3
---

# Styling

Using the styling features.

:::note

These features are only available when working with Adventure components.

For developers: You must use the `StylingI18N` service, from the `glossa-adventure` module.

:::

Adventure components - a platform that is practically equivalent to Minecraft chat components -
can be styled by adding color, text decorations, keybind components, etc. These features are
supported in Glossa, through the use of two techniques:
* Styles/formats
* MiniMessage

## Styles

Each I18N service stores a map of keys to styles. A style defines how a component is displayed.

```json
styles: {
  info: { color: "white" }
  variable: { color: "yellow" }
  extra: { color: "gray" }
}
```

Common properties used:

| Key | Description | Examples |
|-----|-------------|----------|
| `color` | The color of text, either as a named color or as a hex value | `red`, `#ff0000` |
| `bold`, `italic`, `underline`, `strikethrough`, `obfuscated` | Toggles the respective text decoration, `true` or `false` | `true` |
| `font` | The text font, used by the client resource pack | `minecraft:uniform` |

## Formats

Each I18N service stores a map of message keys to formats. A format defines what styles are
applied to what parts of a message.

```json
formats: {
  "server.status": {
    __default__: "info"
    # Argument keys should be put in quotes here
    "uptime": "variable"
    "memory": "variable"
  }
}
```
Assuming the translation for `server.status` is:

```icu-message-format
The server has been up for {uptime, number} hours, and has {memory, number} MB of RAM free.
```

any message generated would be styled as:

```xml
<white>The server has been up for <yellow>5<white> hours, and has <yellow>3021<white> MB of RAM free.
```

The `__default__` key defines how the top-level component is styled.
All other keys define how individual arguments are styled.

You can also target keys inside scopes, and separators:

```icu-message-format
Authors: @<authors>[@<name>[{_}]][, ]
```

```json
"authors": {
  __default__: "info"
  "authors.name": "variable"
  "authors.__separator__": "extra"
}
```

```xml
<white>Authors: <yellow>AuthorOne<gray>, <yellow>AuthorTwo
```

## MiniMessage

As the final processing step, text is passed through MiniMessage,
a format for parsing text into components. This allows you to use special component types:

```icu-message-format
Your current keybinds: @<keybinds>[
  {action}: <key:{bind}>]
```

```
Your current keybinds:
  Move Forward: <key.move_forward>
  Jump: <key.jump>
```

The `key.(...)` parts will be displayed by the client as the actual keybind for that action:

```
Your current keybinds:
  Move Forward: w
  Jump: Space
```

To see a full list of what is possible, [see the MiniMessage docs](https://docs.adventure.kyori.net/minimessage/).
