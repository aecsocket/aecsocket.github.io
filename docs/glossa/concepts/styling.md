---
sidebar_position: 3
---

# Styling

Using the styling features.

:::note

These features are only available when working with Adventure components.

For developers: You must use the `AdventureI18NBuilder`, from the `glossa-adventure` module.

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
| `bold`, `italic`, `underline`, `strikethrough`, `obfuscated` | Toggles the respective text decoration | `true`, `false` |
| `font` | The text font, used by the client resource pack | `minecraft:uniform` |

## Formats

Each I18N service stores a map of message keys to formats. A format defines what styles are
applied to what parts of a message:

```json5
formats: {
  "server.status": [
    "info",                 // The style for the entire message
    {                       // The style for individual arguments
      "uptime": "variable", // ..for the `uptime` argument
      "memory": "variable"  // ..for the `memory` argument
    }
  ]
}
```

<table>

<tr>
<td>

```icu-message-format
Server uptime: @uptime{_, number} hours
Memory free: @memory{_, number} MB
```

</td>
<td>

```xml
<white>Server uptime: <yellow>5</yellow> hours</white>
<white>Memory free: <yellow>2,184</yellow> MB</white>
```

</td>
</tr>

</table>

Formats will merge from their immediate parents, so you can define a common style
for a section of translations:

```json5
styles: {
  error: { color: "red" }
  variable: { color: "yellow" }
  extra: { color: "gray" }
}

formats: {
  "error": "error" // all `error.*` messages will use the `error` style
  
  "error.permission": {      // the `error.permission` key will use the `error` style..
    "permission": "variable" // ..but its `permission` argument will be styled `variable`
  }
  
  "error.group": {                 // the `error.group` key will use the `error` style..
    "group": "variable",           // ..but its `group` arguments will be `variable`
    "group.__separator__": "extra" // ..and the separator between `group`s will be `extra`
  }
}
```

<table>

<tr>
<td>

`error.network`

</td>
<td>

```icu-message-format
A network error has occurred.
```

</td>
<td>

```xml
<red>A network error has occurred.</red>
```

</td>
</tr>

<tr></tr><tr>
<td>

`error.permission`

</td>
<td>

```icu-message-format
You do not have the permission @permission{_}!
```

</td>
<td>

```xml
<red>You do not have the permission <yellow>command.give<red>!
```

</td>
</tr>

<tr></tr><tr>
<td>

`error.group`

</td>
<td>

```icu-message-format
You are not part of groups: @groups[@_{_}][, ].
```

</td>
<td>

```xml
<red>You are not part of groups: <yellow>owner<gray>, <yellow>admin<red>.
```

</td>
</tr>

</table>

## MiniMessage

As the final processing step, text is passed through MiniMessage,
a format for parsing text into components. This allows you to use special component types:

```icu-message-format
Your current keybinds: @keybinds[
  @action{_}: <key:@bind{_}>]
```

```xml
Your current keybinds:
  Move Forward: <key.move_forward>
  Jump: <key.jump>
```

The `<key.(...)>` parts will be displayed by the client as the actual keybind for that action:

```
Your current keybinds:
  Move Forward: w
  Jump: Space
```

To see a full list of what is possible, [see the MiniMessage docs](https://docs.adventure.kyori.net/minimessage/).

:::note

MiniMessage provides support for its own styling, e.g. `<red>`, `<#ff0000>`, `<i>`, however it is
recommended to use Glossa's styling for these purposes, since it can interact with the rest of
the Glossa system.

For keybinds, etc. it is perfectly acceptable to use MiniMessage.

:::
