---
sidebar_position: 3
---

# API

The Glossa API is designed entirely around Kotlin and its DSL capabilities. Although the API can be
used in Java, many parts will be less developer-friendly. It also uses Java Locale objects as the main
source of locale-specific info, so make sure you can get a Locale object for whatever language you
are working with.

## Usage

See [the repository page](https://github.com/aecsocket/glossa) to get:
- the latest version
- the artifact coordinates for Maven/Gradle

## Glossa

The main type you will be working with is `Glossa`, which provides methods for generating translations.
To create an implementation, use `glossaStandard`:

```kotlin
// specify a default locale
val english: Locale = Locale.forLanguageTag("en-US")

// specify the strategy for when a message doesn't exist for a given message key
// `Default` will simply output the key itself
// use `DefaultLogging(Logger)` to output the key and a warning to the logger
val invalidMessageProvider: InvalidMessageProvider = InvalidMessageProvider.Default

// create the Glossa instance
val glossa: Glossa = glossaStandard(
    defaultLocale = english,
    invalidMessageProvider = invalidMessageProvider,
) {
    // DSL scope here
}
```

You can then use the functions inside the DSL scope to add data for the engine to use:


```kotlin
glossaStandard(...) {
    substitutions {
        // to insert a raw substitution
        substitution("icon_info", Component.text("(!)", NamedTextColor.GRAY))
        // to insert a substitution parsed by MiniMessage
        miniMessageSubstitution("icon_info", "<gray>(!)")
    }

    styles {
        style("style_info", Style.style(NamedTextColor.GRAY))
    }

    translation(english) {
        message("hello_world", "Hello world!")

        messageList("splashes",
          "Unleash Your Power!",
          "Embark on an Epic Journey!",
          "Join the Battle and Conquer!",
        )

        section("a_section") {
            message("message_in_section", "This is a message in a section")

            section("nested") {
                message("msg", "Message in a nested section - a_section.nested.msg")
            }
        }
    }
}
```

## Message proxies

Glossa allows creating a rich, type-safe message generation API from a Kotlin interface.  Use `Glossa.messageProxy<T>()` to
create a `MessageProxy<T>`, on which you can use `.default` or `.forLocale(Locale)` to get a `T` object representing your
messages.

Function and section names automatically map to `snake_case` names, unless specified otherwise.

```kotlin
// typealias Message = List<Component>

interface Messages {
    // automatically maps to the message key `hello_world`
    fun helloWorld(): Message

    // maps to messages under `the_section`
    val theSection: TheSection
    interface TheSection {
        fun aMessageList(): List<Message>
    }

    @MessageKey("another_key") // remap this function to point to a different key
    fun withSpecialKey(): Message

    @SectionKey("the_section") // remap this property to point to a different section
    val sectionWithSpecialKey: TheSection

    // provide arguments as well
    fun withArguments(
        // equivalent to the argument `replace("text", ...)`
        text: Component,
        // equivalent to the argument `format("coins", ...)`
        coins: Int,
        // `format("player_health", ...)`
        @Placeholder("player_health") health: Float,
        // `format("date_sold", ...)`
        dateSold: Date,
    )
}

val messages: MessageProxy<Messages> = glossa.messageProxy<Messages>()

val forEnglish = messages.forLocale(english)

val msg: Message = forEnglish.helloWorld() // generates `hello_world`

val list: List<Message> = forEnglish.theSection.aMessageList()

val msg2 = forEnglish.withArguments(
    text = Component.text("Hello"),
    coins = 350,
    health = 0.5f,
    dateSold = Date(0),
)
```

## Configurate

Using the Configurate module, you can automatically load data from `ConfigurationNode`s in the model DSL, via model extensions:

```kotlin
val langFile = dataFolder.resolve("en-US.yml")

glossaStandard(...) {
    fromConfigLoader(
        YamlConfigLoader.builder()
            .file(langFile)
            .build()
    )
}
```

This uses the format as described in [Format](format.md).
