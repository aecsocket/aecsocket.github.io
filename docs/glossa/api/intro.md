---
sidebar_position: 1
---

# Intro

Introduction to the API.

:::info

The Dokka documentation is available from [the external Dokka link here](/glossa).

:::

## I18N

The core of the API is the `I18N<T, A>` class.
* `T` represents the type of value that a translation operation creates.
* `A` represents the type of value passed in as an argument.

However, you will mostly be interacting with the `TemplatingI18N<E>` class.
* `E` is passed to `I18N`'s `T` parameter as `List<E>`.
* Arguments are always passed as `ArgumentMap<E>`s.

There are different implementations of `I18N` depending on the module you are using:
* `glossa-core`
  * `StringI18N`
* `glossa-adventure`
  * `StylingI18N`

This document will cover behaviour common across all `TemplatingI18N`s - we will
use the `StringI18N`.

## Hello, World

1. Create an I18N instance, and define the default locale

```kt
val i18n = StringI18N(locale = Locale.US)
```

You can always change this default locale later.

2. Register a translation

```kt
i18n.register(Locale.US,
    "hello_world" to "Hello, world") // we are using the Kotlin infix function `to` here
```

3. Generate a translation

```kt
i18n[Locale.US, "hello_world"]
// -> [ "Hello, world" ]
```

## Register translations

You can register translations for different locales - these will merge on top of
one another.

`Locale.forLanguageTag` is what you should use to create a `Locale` from a string:
[documentation here](https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html#forLanguageTag-java.lang.String-).

```kt
val english = Locale.forLanguageTag("en-US")
val german = Locale.forLanguageTag("de-DE")

val tlEnglish = Translation(english, mapOf(
  "greeting" to "Hello!"
))

val tlGerman = Translation(german, mapOf(
  "greeting" to "Hallo!"
))

val i18n = StringI18N(english)

i18n.register(tlEnglish)
i18n.register(tlGerman)

i18n[english, "greeting"]
// -> [ "Hello!" ]
i18n[german, "greeting"]
// -> [ "Hallo!" ]

// provide no locale to generate the translation for the locale defined ^^ above
i18n["greeting"]
// -> [ "Hello!" ]
```

## Safe calls

Note that `i18n[...]` - shorthand for `i18n.get(...)` - returns a `T?` - nullable. If the
message to be created could not be found at all, not even in the fallback default locale,
the function will return null.

In situations when you require a non-null value, you can use `i18n.safe(...)`. This will
guarantee a non-null value, however what this does exactly is implementation detail.
For a `StringI18N`, it will return a list of a single element: the key passed in.

```kt
i18n.safe("some_unknown_key")
// -> [ "some_unknown_key" ]

i18n.register(Locale.US,
  "english_key" to "This is only in the English locale")

i18n.safe(Locale.GERMAN, "english_key")
// -> [ "This is only in the English locale" ]

i18n.register(Locale.GERMAN,
  "german_key" to "This is only in the German locale")

i18n.safe(Locale.US, "german_key")
// -> [ "german_key" ]: because Locale.US is already the fallback,
// and it doesn't have `german_key`
```

## Add arguments

Use the `TemplatingI18N.Argument<E>` subclasses to add arguments.

Use `import com.github.aecsocket.glossa.core.*` to add convenience functions like infixes.

Use the `arg` infix to define an ICU templated value.

:::caution

Argument keys must only contain `a-z0-9_`:
* lowercase letters
* numbers
* an underscore `_`

:::

```kt
import com.github.aecsocket.glossa.core.* // import arg, argMap, argList, ...

i18n.register(Locale.US,
  "cart.total_items" to "Items in cart: {items, number}")

i18n["cart.total_items",
  // 1. define a map of [string key] to [argument value]
  //    the root argument must *always* be an ArgumentMap
  argMap(
    "items" arg { // key of `items`, and this is an `arg`
      5 // our raw value, passed to the ICU template
    } // this {...} block is code - only ran when the `items` template is needed
  )
)]
// -> [ "Items in cart: 5" ]

// more compactly written as
i18n["cart.total_items", argMap(
  "items" arg {5}
)]
```

Use a scope inside an argument using the `argMap` infix.

Use an iterable list of arguments using the `argList` infix.

```kt
i18n.register(Locale.US,
  "cart.items_list" to """
    Your shopping cart: @<items>[
      - {item_name}]
  """.trimIndent())

i18n["cart.items_list", argMap(
  "items" argList {listOf(
    argMap(
      "item_name" arg {"Chair"}
    ),
    argMap(
      "item_name" arg {"Table"}
    )
  )}
)]
// -> [
//   "Your shopping cart: "
//   "  - Chair"
//   "  - Table"
// ]
```

Add a `List<E>` (in this case, `List<String>`) using the `argSub` infix.

Add a `Localizable<E>` using the `argTl` infix.

```kt
data class CartItem(val name: String, val amount: Int) : Localizable<String> {
  override fun localize(i18n: TemplatingI18N<String>, locale: Locale) =
    i18n.safe(locale, "cart.item", argMap(
      "name" to {name},
      "amount" to {amount}
    ))
}

i18n.register(Locale.US,
  "cart.item" to "{name} x{amount, number}",
  "cart.items_list" to """
    Your shopping cart: @<items>[
      - @$<item>]
  """.trimIndent())

val chair = CartItem("Chair", 4)
val table = CartItem("Table", 2)

i18n["cart.items_list", argMap(
  "items" argList {listOf(mapOf(
    "item" argSub {listOf("Some item")}
  ), mapOf(
    "item" argTl {chair}
  ), mapOf(
    "item" argTl {table}
  ))}
)]
// -> [
//   "Your shopping cart: "
//   "  - Some item"
//   "  - Chair x4"
//   "  - Table x2"
// ]
```

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

## Loading from an external source

You can load translations into a `MutableI18N` using the extension function
`MutableI18N.loadTranslations`. This takes a `ConfigurationLoader` from
[Configurate](https://github.com/spongepowered/configurate), which determines how to
load a string/file/stream/etc. into the translation.

The recommended format to load in is [HOCON](https://github.com/lightbend/config).

To add `configurate-hocon` to your project, follow the instructions on
[the Configurate repo](https://github.com/spongepowered/configurate).

```kt
i18n.loadTranslations(HoconConfigurationLoader.builder()
  .source { BufferedReader(StringReader("""
    # This defines for what locale the translation is made
    __locale__: en-US
    # You should always quote keys
    # Otherwise, `friend.requests` will be interpreted as a `requests` map inside a `friend` map
    "hello_world": "Hello world!"
    "friend.requests": [
      "Friend requests: {total, number} @<requests>[
        {name}]"
    ]
  """.trimIndent())) }
  .build())

i18n["hello_world"]
// -> [ "Hello world!" ]
```

To load from a file:

```kt
val file = File("formats.conf")
val path = Path("formats.conf")

i18n.loadTranslations(HoconConfigurationLoader.builder()
  // you can use either one of:
  .file(file)
  .path(path)
  
  .build())
```
