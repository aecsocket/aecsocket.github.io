---
sidebar_position: 1
---

# Glossa

[GitHub](https://github.com/aecsocket/glossa) | [Dokka](pathname:///glossa/dokka/index.html)

---

ICU-based localization library.

Glossa provides a way for developers to both localize and configure messages in the same format string.
It's designed around Kotlin, taking advantage of its DSL features, with currently minimal support for Java -
but being a JVM language, it will run on a JVM environment.

## Features

### ICU under the hood

Unicode's [ICU4J](https://icu.unicode.org/) is a library introducing many localization features, such as:
* Plurals
* Number formatting
* Currency support

Glossa uses ICU4J to parse templates in one stage of its templating process,
so translations can use these features without compromise.

<!-- use empty <tr> in between to trick zebra striping in GH markdown -->

<table>

<tr>
<td>

```icu-message-format
You have @items{_, plural,
  one {# item}
  other {# items}
} in your cart
```

</td>
<td>

```kotlin
i18n.make("cart_items") {
  raw("items") { 1 }
}
```

</td>
<td>

English
```xml
You have 1 item in your cart
```

</td>
</tr>

<tr></tr><tr>
<td>

```icu-message-format
Items processed:
  @complete{_, number} / @total{_, number}
  (@percent{_, number, percent})
```

</td>
<td>

```kotlin
i18n.make("item_queue.processed") {
  raw("complete") { 115 }
  raw("total") { 1000 }
  raw("percent") { 0.115 }
}
```

</td>
<td>

```xml
Items processed:
  115 / 1,000
  (11.5%)
```
German
```xml
Items processed:
  115 / 1.000
  (11.5 %)
```

</td>
</tr>

<tr></tr><tr>
<td>

```icu-message-format
Health: @health{_, number, :: %x100 .00}
Money: @money{_, number, :: compact-short}
```

</td>
<td>

```kotlin
i18n.make("hud.status") {
  raw("health") { 0.56789 }
  raw("money") { 11700 }
}
```

</td>
<td>

English
```xml
Health: 56.79%
Money: 12K
```

French
```xml
Health: 56,79 %
Money: 12 k
```

</td>
</tr>

</table>

### Scopes

Glossa uses the concept of **scopes** to determine:
* how many times a part of the translation is repeated
* what arguments are used in a part of the translation

This allows translations to handle iterable data seamlessly:

<table>

<tr>
<td>

```icu-message-format
Your purchases: @purchases[
  · "@item{_}" x@amount{_, number}]
```

</td>
<td>

```kotlin
i18n.make("purchases") {
  list("purchases") {
    map {
      raw("item") { "Alpha" }
      raw("amount") { 3 }
    }
    map {
      raw("item") { "Beta" }
      raw("amount") { 2 }
    }
    map {
      raw("item") { "Gamma" }
      raw("amount") { 5505 }
    }
  }
}
```

</td>
<td>

```xml
Your purchases:
  · "Alpha" x3
  · "Beta" x2
  · "Gamma" x5,505
```

</td>
</tr>

</table>

You can define separators, and use short list syntax:

<table>

<tr>
<td>

```icu-message-format
Authors: @authors[@name{_}][, ]
```

</td>
<td>

```kotlin
i18n.make("command.about.authors") {
  list("authors") {
    map {
      raw("name") { "AuthorOne" }
    }
    map {
      raw("name") { "AuthorTwo" }
    }
  }
}
```

</td>
<td>

```xml
Authors: AuthorOne, AuthorTwo
```

</td>
</tr>

<tr></tr><tr>
<td>

```icu-message-format
Authors: @authors[@_{_}][, ]
```

</td>
<td>

```kotlin
i18n.make("command.about.authors") {
  list("authors") {
    raw("AuthorOne")
    raw("AuthorTwo")
  }
}
```

</td>
<td>

```xml
Authors: AuthorOne, AuthorTwo
```

</td>
</tr>

</table>

### Substitution

Insert already-generated values (such as the output of other translation operations)
into an existing translation:

<table>

<tr>
<td>

```icu-message-format
You rececived: @items[
  · @item_name()]
```

</td>
<td>

```kotlin
import adventure.Component.*
import adventure.NamedTextColor.*

i18n.make("notification.items.received") {
  list("items") {
    map {
      sub("item_name") { listOf(text("Fire Sword"), RED) }
    }
    map {
      sub("item_name") { listOf(text("Water Sword"), BLUE) }
    }
  }
}
```

</td>
<td>

```xml
You received:
  · <red>Fire Sword</red>
  · <blue>Water Sword</blue>
```

</td>
</tr>

</table>

From the API, you can even directly insert `Localizable` instances:

```kotlin
// store_item = "@name{_} worth @value{_, number} coins"
// store_item.name.xp_booster = "XP Booster"
// store_item.name.coin_booster = "Coin Booster"

data class StoreItem(val id: String, val value: Int) : Localizable<String> {
  override fun localize(i18n: I18N<String>): List<String> =
    i18n.safe("store_item") {
      raw("name") { i18n.safe("store_item.name.$id") }
      raw("value") { value }
    }
}

val xpBooster = StoreItem("xp_booster", 200)
val coinBooster = StoreItem("coin_booster", 300)
```

<table>

<tr>
<td>

```icu-message-format
You rececived: @items[
  · @_()]
```

</td>
<td>

```kotlin
i18n.make("notification.items.received") {
  list("items") {
    tl(xpBooster)
    tl(coinBooster)
  }
}
```

</td>
<td>

```xml
You received:
  · XP Booster worth 200 coins
  · Coin Booster worth 300 coins
```

</td>
</tr>

</table>

### Designed around Kotlin

Using Kotlin means syntax is nicer compared to Java:

```kotlin
val i18n = StringI18NBuilder(Locale.US).apply {
  register(Locale.US) {
    section("listing") {
      value("posts", "Posts:")
      value("news", "News:")
    }
    section("post_info") {
      value("header", """
          @name{_} by @author{_}, uploaded on @upload_date{_, date}
          @likes{_, plural, one {# like} other {# likes}}
      """.trimIndent())
    }
  }
}.build()

i18n.make("post_info.header") {
  raw("name") { "Some Post" }
  raw("author") { "SiteAdmin" }
  raw("upload_date") { Date(0) }
  raw("likes") { 63 }
}
```

All values in maps are also **lazy loaded** - the value inside the `{...}` blocks will only be computed
if the template only appears in the format:

```kotlin
val i18n = i18nBuilder.apply {
  register(Locale.US) {
    value("vector_length", "X = @x{_}, Y = @y{_}, length = @length{_}")
    value("vector_no_length", "X = @x{_}, Y = @y{_}")
  }
}.build()

val (x, y) = Vector(3, 4)

i18n.make("vector_length") {
  raw("x") { x }
  raw("y") { y }
  raw("length") { sqrt(x*x + y*y) }
}
// -> X = 3, Y = 4, length = 5

i18n.make("vector_no_length") {
  raw("x") { x }
  raw("y") { y }
  raw("length") { sqrt(x*x + y*y) }
}
// -> X = 3, Y = 4
// The sqrt() is not called - a whole operation saved
```

### Adventure support

[Adventure](https://github.com/kyoriPowered/adventure) is a library for managing Minecraft chat components.
Glossa has support for - and is partially designed around - generating these components in localization,
through the `glossa-adventure` module.

### Configurate support

[Configurate](https://github.com/spongepowered/configurate) is a library for loading configuration files.
Glossa has support for deserializing translation and configuration files using Configurate,
through the `glossa-configurate` module.
