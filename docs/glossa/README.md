---
sidebar_position: 1
---

# Glossa

ICU-based localization library.

Glossa provides a way for developers to both localize and configure messages in the same format string. It's written in Kotlin, allowing it to be used on the JVM while still having interop with Java code.

## Features

### ICU under the hood

Unicode's [ICU4J](https://icu.unicode.org/) is a library introducing many localization features, such as:
* Plurals
* Number formatting
* Currency support

Glossa uses ICU4J to parse templates in one stage of its templating process,
so translations can use these features without compromise.

**Format**
```icu-message-format
You have {items, plural, one {# item} other {# items}} in your cart
```

**Arguments**
```json
{ "items": 1 }
```

**Result**
```
You have 1 item in your cart
```

**Arguments**
```json
{ "items": 3 }
```

**Result**
```
You have 3 items in your cart
```

### Scopes

Glossa uses the concept of **scopes** to determine:
* how many times a part of the translation is repeated
* what arguments are used in a part of the translation

This allows translations to handle iterable data seamlessly:

**Format**
```icu-message-format
Your purchases: @<purchases>[
  - "{item}" x{amount, number}]
```

**Arguments**
```json
{ "purchases": [
  { "item": "Alpha", "amount": 3 },
  { "item": "Beta",  "amount": 2 },
  { "item": "Gamma", "amount": 5505 }
] }
```

**Result**
```
Your purchases:
 - "Alpha" x3
 - "Beta" x2
 - "Gamma" x5,505
```

You can even define separators:

**Format**
```icu-message-format
Authors: @<authors>[{name} ({social_media_handle})][, ]
```

**Arguments**
```json
{ "authors": [
  { "name": "AuthorOne", "social_media_handle": "@authorone" },
  { "name": "AuthorTwo", "social_media_handle": "@authortwo" }
] }
```

**Result**
```
Authors: AuthorOne (@authorone), AuthorTwo (@authortwo)
```

### Substitution

Insert already-generated values (such as the output of other translation operations)
into an existing translation:

**Format**
```icu-message-format
You received: @<item>[
  - @$<item_name>]
```

**Arguments**
```json
{ "item": [
  { "item_name": "(..result of another localization operation)" },
  { "item_name": "(..result of another localization operation)" }
] }
```

**Result**
```
You received:
 - Item Foo
 - Item Bar
```

From the API, you can even directly insert `Localizable` instances:
```kt
data class Item(val id: String) : Localizable<String> {
    override fun localize() /* ... */
}

Item("foo").localize() // -> [ "Item Foo" ]
Item("bar").localize() // -> [ "Item Bar" ]

i18n["message_key", argMap(
    "item" argList {listOf(
        argTl(Item("foo")), // uses .localize
        argTl(Item("bar"))
    )}
)]
```

### Designed around Kotlin

Using Kotlin means syntax is nicer compared to Java:

```kotlin
val i18n = StringI18N(Locale.US)
i18n.register(Locale.US,
    "liked_post" to """
        {name} liked {amount, plural, one {one of your posts} other {# of your posts}} on {date, date, short}: @<posts>[
          "{post_name}" likes now: {likes, number}]
    """.trimIndent())
i18n["liked_post", argMap(
    "name" arg {"SomeUser"},
    "amount" arg {2},
    "date" arg {Date(System.currentTimeMillis())},
    "posts" argList {listOf(argMap(
        "post_name" arg {"My first post"},
        "likes" arg {16}
    ), argMap(
        "post_name" arg {"My second post"},
        "likes" arg {11}
    ))}
)]
```

All values are also **lazy loaded** - the value inside the `{...}` blocks will only be computed
if the template only appears in the format:

```kt
i18n.register(Locale.US,
    "vector_one" to "X = {x, number}, Y = {y, number}, length = {length, number}",
    "vector_two" to "X = {x, number}, Y = {y, number}")
val args = argMap(
    "x" arg {vector.x},
    "y" arg {vector.y},
    "length" arg {vector.length}
)
// This template uses `length`, so `{vector.length}` is computed
i18n["vector_one", args] // -> X = 3, Y = 4, length = 5
// This template doesn't use `length`, so nothing is computed for that
i18n["vector_two", args] // -> X = 3, Y = 4
```

This means that expensive calculations (e.g. the length of a vector using sqrt) will only be
performed if required.

### Adventure support

[Adventure](https://github.com/kyoriPowered/adventure) is a library for managing Minecraft chat components.
Glossa has support for - and is partially designed around - generating these components in localization,
through the `glossa-adventure` module.
