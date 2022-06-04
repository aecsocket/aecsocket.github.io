---
sidebar_position: 1
---

# Intro

Introduction to the API.

:::info

The Dokka documentation is available from [the external Dokka link here](/glossa).

:::

## I18N

The core of the API is the `I18N<T>` class, with `T` representing the type of value that a translation
operation creates. You can create an `I18N<T>` instance using various `I18N.Builder<T>` implementations.

The current `I18N.Builder<T>` implementations by module:
* `glossa-core`
  * `StringI18NBuilder` : `I18N<String>`
* `glossa-adventure`
  * `AdventureI18NBuilder` : `I18N<Component>`

This document will cover behaviour common across all `I18N`s - it will use the `StringI18N`.

## Hello, World

1. Create an I18N builder, and define the default locale

```kotlin
val builder = StringI18NBuilder(locale = Locale.US)
```

You can always change this default locale later.

2. Register a translation

```kotlin
val builder = StringI18NBuilder(Locale.US).apply {
  register(Locale.US) {
    value("hello_world", "Hello, world")
  }
}
```

3. Generate a translation

```kotlin
val i18n: I18N<String> = builder.build()

i18n.make(Locale.US, "hello_world")
// -> [ "Hello, world" ]
```

## Register translations

You can register translations for different locales - these will merge on top of
one another.

`Locale.forLanguageTag` is what you should use to create a `Locale` from a string:
[documentation here](https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html#forLanguageTag-java.lang.String-).

```kotlin
val english = Locale.forLanguageTag("en-US")
val german = Locale.forLanguageTag("de-DE")

val i18n = StringI18NBuilder(english).apply {
  register(english) {
    value("greeting", "Hello!")
    value("greeting", "Hallo!")
  }
}.build()

i18n.make(english, "greeting")
// -> [ "Hello!" ]

i18n.make(german, "greeting")
// -> [ "Hallo!" ]

// providing no locale, we generate for `english`
i18n.make("greeting")
// -> [ "Hello!" ]
```

The locale passed to the builder will determine the fallback locale - which locale a message
is generated for, if a key in the desired locale does not exist.

```kotlin
val i18n = StringI18NBuilder(english).apply {
  register(english) {
    value("english_key", "This is only in English")
  }

  register(german) {
    value("german_key", "This is only in German")
  }
}

i18n.make(english, "english_key")
// -> [ "This is only in English" ]

i18n.make(german, "german_key")
// -> [ "This is only in German" ]

i18n.make(german, "english_key")
// -> [ "This is only in English" ]

i18n.make(english, "german_key")
// -> null
```

## Safe calls

Note that `i18n.make` returns a `T?` - nullable. If the message to be created could not be found at all,
not even in the fallback default locale, the function will return null.

In situations when you require a non-null value, you can use `i18n.safe(...)`. This will
guarantee a non-null value, however what this does exactly is implementation detail.
For a `StringI18NBuilder`'s, it will return a list of a single string: the key passed in.

```kotlin
i18n.safe("some_unknown_key")
// -> [ "some_unknown_key" ]

i18n.safe(english, "german_key")
// -> [ "german_key" ]
```

## Translation sections

Translations are stored in a node structure, where a node can either:
* hold children (a section node)
* hold a value (a value node)

Sections are logical colections of translations, and are separated by the `.` character.
They are defined in the translation DSL like so:

```kotlin
StringI18NBuilder(english).apply {
  register(english) {
    section("hud") {
      value("health", "Health: ...")
      value("money", "Money: ...")
      section("inventory") {
        value("carrying", "Carrying weight: ...")
        value("carry_max", "Max carrying weight: ...")
      }
    }
  }
}
```

## Add arguments

Glossa provides a DSL for adding arguments to `i18n.make` and `i18n.safe` calls, using the
`Argument.MapScope` class. In practice:

```kotlin
val i18n = StringI18NBuilder(english).apply {
  register(english) {
    value("cart_items", "Items in cart: @items{_, number}")
  }
}

i18n.make(english, "cart_items") {
  // DSL scope here
  raw("items") { cartItems.size } // `raw` argument type
}
```

| Argument type | Method | Template type | Description |
|---------------|--------|---------------|-------------|
| Raw | `raw` | `@key{...}` | Passed into ICU templater |
| Substitution | `sub` | `@key(...)` | Replaced with the raw `T` type (e.g. Adventure `Component`s) |
| Translation | `tl` | `@key(...)` | Same as substitution, but pass a `Localizable<T>` |
| Map | `map` | `@key[...]` | Defines a scope |
| List | `list` | `@key[...]` | Defines a scope which repeats for `n` elements in the list |

Examples:

<table>

<tr>
<td>

```icu-message-format
Cart details: @details[
  · Items: @amount{_, number}
  · Price: @price{_, number}]
```

</td>
<td>

```kotlin
i18n.make("cart_details") {
  map("details") {
    raw("amount") { 6 }
    raw("price") { 38.50 }
  }
}
```

</td>
</tr>

<tr></tr><tr>
<td>

```icu-message-format
Items in cart: @items[
  · @item{_}]
```

</td>
<td>

```kotlin
i18n.make("cart_items") {
  list("items") {
    map {
      raw("item") { "Chair" }
    }
    map {
      raw("item") { "Table" }
    }
  }
}
```

</td>
</tr>

<tr></tr><tr>
<td>

```icu-message-format
Items in cart: @items[
  · @_()]
```

</td>
<td>

```kotlin
i18n.make("cart_items") {
  list("items") {
    sub("Chair")
    sub("Table")
  }
}
```

</td>
</tr>

<tr></tr><tr>
<td>

`store_item.fire_sword`
```icu-message-format
Fire Sword
```

`store_item.ice_sword`
```icu-message-format
Ice Sword
```

`store_items`
```icu-message-format
Items in store: @items[
  · @_[_()]]
```

</td>
<td>

```kotlin
data class StoreItem(
  val id: String,
  val price: Int
) : Localizable<String> {
  override fun localize(i18n: I18N<String>) =
    i18n.safe("store_item.$id") {
      raw("price") { price }
    }
}

val fireSword = StoreItem("fire_sword", 300)
val iceSword = StoreItem("ice_sword", 400)

i18n.make("store_items") {
  list("items") {
    tl(fireSword)
    tl(iceSword)
  }
}
```

</td>
</tr>

</table>

## Naming convention

* In message keys:
  * Use `a-z0-9_` for individual segments
  * Use `.` as a separator between categories
  * Use the singular form for categories
    * Use plural form for the ending segment, if it represents multiple values
  * Examples
    * `message.chat.incoming_message`
    * `message.chat.outgoing_messages`
* In argument keys:
  * Use only `a-z0-9_`
  * For arguments representing a single value, use the singular form
  * For iterable arguments (e.g. `argList`s), use the plural form
  * Examples
    * `item_name` : template argument
    * `cart_items` : argument list
