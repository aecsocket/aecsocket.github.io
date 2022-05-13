---
sidebar_position: 1
---

# Concepts

The basic concepts of Glossa.

## Translations

At its core, a **translation operation** is a lookup in a key-value map, where strings map
to lists of strings (for developers, `Map<String, List<String>>`).
However, **internationalization (I18N)** services provided by Glossa will do processing on these,
to add features like **scopes** and **substitutions**.

```json
{
  "followers.added": [
    "On {date, date, short}, {follower} started following you.",
    "You now have {total, number} followers."
  ],
  "error.generic": "This action failed. Please try again."
}
```

The blocks `{date, ...}`, `{follower}`, `{total, ...}` are **templates** - parts which are
replaced with values provided in-code: **arguments**. These templates are written as
[ICU message formats](https://icu.unicode.org/), which is an industry standard format that
is used across many different applications.

```
On 12/02/19, OneOfYourFollowers started following you.
You now have 184 followers.
```

:::tip

You can find a more complete guide on ICU features on the [ICU format](concepts/icu) page.
This should be read by both users and developers!

:::

## Scopes

A scope is a block in a translation that can be used for various different features. One of
the most important uses of scopes is for repeating arguments.

`@<_key_>[_content_]` defines a scope with argument key `_key_`, and content of `_content_`.

```icu-message-format
Your recent purchases: @<purchases>[
  - {amount, number}x "{item}"]
```

```
Your recent purchases:
 - 6x Ruler
 - 5x Pencil
 - 2x Ruler
```

You can also nest scopes.

```icu-message-format
Your recent actions: @<actions>[
  {date, date, short}: Created {total, number} files @<file>[
    - File "{filename}" size {size} MB]]
```

```
Your recent actions:
  01/01/20: Created 3 files
    - File "one.txt" size 2 MB
    - File "two.txt" size 3 MB
    - File "three.txt" size 10 MB
  02/01/20: Created 2 files
    - File "foo.txt" size 4 MB
    - File "bar.txt" size 6 MB
```

You can define separators, which are added in between each repetition (if no separator is
defined, the repetitions are just joined together).

`@<_key_>[_content_][_separator_]` defines a scope with argument key `_key_`, content of `_content_`,
and separator of `_separator_`.

```icu-message-format
Authors: @<authors>["{name}"][, ]
```

```
Authors: "AuthorOne", "AuthorTwo", "AuthorThree"
```

If it is defined so in code, and the scope only has one argument, you can use a shorthand
in the ICU template:

```icu-message-format
Authors: @<authors>["{_}"][, ]
```

## Substitutions

Some parts of the format may be replaced with already-generated parts, that are *not*
passed through ICU templates.

`@<_key_>` defines a substitution with argument key `_key_`

:::info

For developers: In the API, for a given I18N service `TemplatingI18N<E>`, the substitutions
provided must be `List<E>`. Conveniently, you can use the output of `TemplatingI18N.get`
operations to get such a `List<E>`. Therefore, you can effectively nest one translation
inside another (but, this might not be the best way to do it for your use case! Keep reading.)

:::

:::note

For this section, we will assume you are using Adventure/Minecraft chat components,
making it easier to demonstrate some features of substitutions.

:::

```icu-message-format
Here are your gifts: @<gifts>[
  - @$<gift_name>]
```

```
Here are your gifts:
  - <red>The Red Gift</red>
  - <blue>The Blue Gift</blue>
```

Note the coloured parts here, `<red>...</red>` and `<blue>...</blue>` - they weren't in
the original message format. Instead, they came from *raw components* being passed into
that argument `gift_name`:

```kt
import net.kyori.adventure.text.Component.*
import net.kyori.adventure.text.format.NamedTextColor.*

i18n["message.receive.gifts", argMap(
  "gifts" argList {listOf(argMap(
    "gift_name" argSub /* note the argSub here! */ {listOf(text("The Red Gift", RED))}
  ), argMap(
    "gift_name" argSub {listOf(text("The Blue Gift", BLUE))}
  ))}
)]
```

Because substitutions may contain multiple lines, you can define a separator between each
element (if no separator is specified, then the elements are just joined together).

`@$<_key_>[_separator_]` defines a substitution with argument key `_key_`, and separator
`_separator_`.

```icu-message-format
Here are your gifts: @<gifts>[
  - @$<gift_name>[ | ]]
```

```
Here are your gifts:
  - <red>The Red Gift</red> | It's quite a red gift!
  - <blue>The Blue Gift</blue> | It's quite a blue gift!
```

```kt
i18n["message.receive.gifts", argMap(
  "gifts" argList {listOf(argMap(
    "gift_name" argSub {listOf(
      text("The Red Gift", RED),
      text("It's quite a red gift!")
    )}
  ), argMap(
    "gift_name" argSub {listOf(
      text("The Blue Gift", BLUE),
      text("It's quite a blue gift!")
    )}
  ))}
)]
```

:::tip

For developers: implementing the `Localizable` interface, you can directly translate objects using
an `argTl` argument. This is the recommended approach if you have control over the class you want
to translate. See more info in the next section.

:::

## Creating templates, scopes and substitutions

When should you use a template vs. a substitution?

### As a user

The features you should use are entirely dependent on how the arguments are created in code.
If in doubt, look at the default translation files and copy what they do.

original `en-US`:
```
Books: {books, number}
Name: @$<name>[, ]
```

correct `de-DE`:
```
Bücher: {books, number}
Name: @$<name>[, ]
```

wrong `de-DE`:
```
Bücher: @$<books>
Name: {name}
```

### As a developer

Formattable objects (e.g. strings, numbers, `Date`s) should be placed in a template.

```kt
i18n["message", argMap(
  "date_now" arg /* <-- important! */ {Date(System.currentTimeMillis())}
)]
```

Objects which are of the same type as the I18N service accepts - assuming a
`TemplatingI18N<E>`, you have a `List<E>` (for example, a `List<Component>`) -
should be placed in a substitution.

```kt
val i18n: TemplatingI18N<Component> = StylingI18N()
val name: Component = itemStack.displayName()
val lore: List<Component> = itemStackMeta.lore()

i18n["item.lore", argMap(
  "item_name" argSub /* <-- important! */ {listOf(name)},
  "item_lore" argSub {lore}
)]
```

Raw objects (e.g. your own custom classes which you want to localize) can be translated in
two ways.

#### Translated manually

```kt
data class NamedVector(val id: String, val x: Float, val y: Float)

val vector = Vector("spawn_point", 5.5, 6)

i18n["vector", argMap(
  "name" argSub {i18n["vectors.${vector.id}"]}, // we generate the value for key `vectors.spawn_point`
  "x" arg {vector.x},
  "y" arg {vector.y}
)]

```

### Use a Localizable

```kt
data class NamedVector(val id: String, val x: Float, val y: Float)
    : Localizable<Component> {
    override fun localize(i18n: TemplatingI18N<Component>, locale: Locale) =
      i18n.safe(locale, "vectors.$id", argMap(
        "x" arg {x},
        "y" arg {y}
      ))
}

val vector = Vector("spawn_point", 5.5, 6)

i18n["vector", argMap(
  "vector" argTl /* <-- important! */ {vector}
)]
```
