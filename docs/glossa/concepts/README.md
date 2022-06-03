---
sidebar_position: 1
---

# Concepts

The basic concepts of Glossa.

## Translations

At its core, a **translation operation** is like a dictionary, where you look up one piece of text (the value)
based on another piece of text (the key).
With this text, **Internationalization (I18N)** services provided by Glossa will do processing,
to add features like **scopes** and **substitutions**.

```json
error: {
  network: "A network error occurred. Check your connection."
  generic: "This action failed. Please try again."
}
followers: {
  added: [
    "On @date{_, date, short}, @follower{_} started following you."
    "You now have @total{_, number} followers."
  ]
}
```

The blocks `@date{_, ...}`, `@follower{_}`, `@total{, ...}` are **templates** - parts which are
replaced with values provided in-code: **arguments**. These templates are written as
[ICU message formats](https://icu.unicode.org/), which is an industry standard format that
is used across many different applications.

```xml
On 12/02/19, OneOfYourFollowers started following you.
You now have 184 followers.
```

:::note

Glossa's template formats are slightly different to the standard format used in other ICU
applications (note the use of `_` as the key) - this is just an internal change, and all
other functions stay the same.

:::

:::tip

You can find a more complete guide on ICU features on the [ICU format](concepts/icu) page.
This should be read by both users and developers!

:::

:::caution

Argument keys must only contain `a-z0-9_`:
* lowercase letters
* numbers
* an underscore `_`

:::

## Scopes

A scope is a block in a translation that can be used for various different features. One of
the most important uses of scopes is for repeating arguments.

`@_key_[_content_]` defines a scope with argument key `_key_`, and content of `_content_`.

<table>

<tr>
<td>

```icu-message-format
Your recent purchases: @purchases[
  · @amount{_, number}x "@item{_}"]
```

</td>
<td>

```
Your recent purchases:
  · 6x Ruler
  · 5x Pencil
  · 2x Ruler
```

</td>
</tr>

</table>

You can also nest scopes:

<table>

<tr>
<td>

```icu-message-format
Your recent actions: @actions[
  @date{_, date, short}: Created @total{_, number} files @file[
    · File "@filename{_}" size @size{_, number} MB]]
```

</td>
<td>

```
Your recent actions:
  01/01/20: Created 3 files
    · File "one.txt" size 2 MB
    · File "two.txt" size 3 MB
    · File "three.txt" size 10 MB
  02/01/20: Created 2 files
    · File "foo.txt" size 4 MB
    · File "bar.txt" size 6 MB
```

</td>
</tr>

</table>

You can define separators, which are added in between each repetition (if no separator is
defined, the repetitions are just joined together).

`@_key_[_content_][_separator_]` defines a scope with argument key `_key_`, content of `_content_`,
and separator of `_separator_`.

<table>

<tr>
<td>

```icu-message-format
Authors: @authors["@name{_}"][, ]
```

</td>
<td>

```
Authors: "AuthorOne", "AuthorTwo", "AuthorThree"
```

</td>
</tr>

</table>

If the code defines the arguments in the concise format, you can use a shorthand in the format:

<table>

<tr>
<td>

```icu-message-format
Authors: @authors["@_{_}"][, ]
```

</td>
<td>

```
Authors: "AuthorOne", "AuthorTwo", "AuthorThree"
```

</td>
</tr>

</table>

## Substitutions

Some parts of the format may be replaced with already-generated parts, that are *not*
passed through ICU templates.

`@_key_(_separator_)` defines a substitution with argument key `_key_`, and separator between
components `_separator_`

:::note

For this section, we will assume you are using Adventure/Minecraft chat components,
making it easier to demonstrate some features of substitutions.

:::

<table>

<tr>
<td>

```icu-message-format
Gifts received today: @gifts[
  · @gift_name( | )]
```

</td>
<td>

```xml
Gifts received today:
  · <red>Fire Sword</red> | Sets enemies on fire
  · <blue>Ice Sword</blue> | Freezes enemies
```

</td>
</tr>

</table>

Note the coloured parts here, `<red>...</red>` and `<blue>...</blue>` - they weren't in
the original message format. Instead, they came from *raw components* being passed into
that argument `gift_name`:

```json
"gifts": [
  {
    "gift_name": [
      { "text": "Fire Sword", "color": "blue" },
      "Sets enemies on fire"
    ]
  },
  {
    "gift_name": [
      { "text": "Ice Sword", "color": "blue" },
      "Freezes enemies"
    ]
  }
]
```

:::info

For developers: In the API, for a given I18N service `I18N<T>`, the substitutions
provided must be `List<T>`. Conveniently, you can use the output of `I18N.make: List<T>`
operations to get such a list.

Glossa provides direct support for such an operation through the `Localizable` interface,
and the `tl` argument type.

```kotlin
data class Item(val id: String) : Localizable<String> {
  override fun localize(i18n: I18N<String>): List<String> =
    i18n.safe("item.$id")
}

i18n.safe("gifts") {
  list("gifts") {
    map {
      tl("gift_name") { Item("fire_sword") }
    }
  }
}
```

:::
