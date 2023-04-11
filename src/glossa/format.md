# Format

A translation file, such as `en-US.yml` or `root.yml` defines all the info that the translation engine uses.
There are three main sections: `translations`, `substitutions` and `styles`, which separate translated text
and styling the text.

## Keys

Glossa allows only a specific set of characters in keys, `/([a-z0-9_])+/`, which means only:
- lowercase letters `a-z`
- numbers `0-9`
- an underscore `_`

Using any other characters will produce an error!

## Translations

The bulk of the work is done in this section. This section defines the text strings for each message key and
locale. This block defines the message generated when the message key `hello_world` is generated:

```yaml
translations:
  # the locale that this block is for
  en-US:
    # the message key, `hello_world`, and its value, `Hello World!`
    hello_world: "Hello World!"
```

Note that you should always wrap **single-line** text strings in quotes (even if you're not technically required to!),
to make sure it is valid YAML.

Translations for multiple locales can be included in one `translations` block:

```yaml
translations:
  en-US: # American English
    shovel: "Shovel"
  en-GB: # British English
    shovel: "Spade"
```

The local key (`en-US`, `en-GB`) must be specified in [the `Locale.forLanguageTag` format](https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html#forLanguageTag-java.lang.String-).

Translations can be stored under **sections** to categorise them:

```yaml
en-US:
  hello_world: "Hello World!"

  command:
    # command.ban
    ban: "Banned a player"
    # command.kick
    kick: "Kicked a player"

  gui:
    store:
      # gui.store.title
      title: "Store"
    crafting:
      # gui.crafting.title
      title: "Crafting Station"
```

Multiple lines can be included in a message:

```yaml
player_welcome: |- # `|-` means "multiline text, preserve newlines"
  Welcome to the server!
  
  Walk forward to enter the hub, or
  walk left to enter the trading hall.
item_description: >- # `>-` means "multiline text, remove newlines"
  Behold the Enchanted Talisman, a powerful artifact infused with ancient magic
  that grants the wielder the ability to summon spectral creatures to fight at
  their side. Harness the Talisman's energy to turn the tide of battle and vanquish
  even the mightiest foes.
```

You don't need to wrap multiline text strings in quotes in YAML.

If the message key supports it, multiple messages (not lines!) can also be created:

```yaml
splash_messages:
  - "Unleash Your Power!"
  - "Embark on an Epic Journey!"
  - "Join the Battle and Conquer!"
  - "Become a Legend!"
  - |-
    You can also put multi-line messages
    inside a list of messages
```

### Templates

When a message is generated, the code can pass in **arguments**, which replace **templates** in the text string.
There are two different types of templates: MiniMessage and ICU templates.

#### MiniMessage

These templates are enclosed in `<angled_brackets>`, and use the Adventure MiniMessage format for parsing.
They allow inserting existing text components into the translation, such as the output of another translation
operation.

```yaml
colored_message: "<red>This part of the message is red <bold>and also bold</bold>, but <blue>this part is blue"
```

```yaml
store_info: |-
  Store info:
    - Most sold item: <most_sold>
    - Highest priced item: <highest_priced> at <highest_price> Gold
```

With the arguments:
- `most_sold`: `<red>Fire Sword`
- `highest_priced`: `<blue>Special Gem`
- `highest_price`: `500`

Produces:
```xml
Store info:
  - Most sold item: <red>Fire Sword
  - Highest priced item: <blue>Special Gem</blue> at 500 Gold
```

**Read the guide here: [MiniMessage Format](https://docs.advntr.dev/minimessage/format.html)**

#### ICU

These templates are enclosed in `{curly_brackets}`, and use the [Unicode ICU](https://icu.unicode.org/) format for
parsing. They allow parsing raw values, such as numbers and dates, in a format that respects the user's locale settings.

```yaml
player_stats: "Kills: {kills, number} / Money: {money, number, :: .00} USD"
```

<table>

<tr>
  <td>Arguments</td>
  <td><code>en-US</code></td>
  <td><code>fr-FR</code></td>
  <td><code>de-DE</code></td>
</tr>

<tr>
  <td>
    <code>kills = 12345</code></br>
    <code>money = 101.45</code>
  </td>
  <td>
    <code>Kills: 12,345 / Money: 101.45 USD</code>
  </td>
  <td>
    <code>Kills: 12 345 / Money: 101,45 Gold</code>
  </td>
  <td>
    <code>Kills: 12.345 / Money: 101,45 Gold</code>
  </td>
</tr>

</table>

```yaml
en-US:
  sold_item: >-
    You sold {num_items, plural,
      =0 {no items}
      one {# item}
      other {# items}
    } on {date_sold, date, short}.
fr-FR:
  sold_item: >-
    Vous avez vendu {num_items, plural,
      =0 {aucun objet}
      one {# objet}
      other {# objets}
    } le {date_sold, date, short}.
```

<table>

<tr>
  <td>Arguments</td>
  <td><code>en-US</code></td>
  <td><code>fr-FR</code></td>
</tr>

<tr>
  <td>
    <code>num_items = 0</code></br>
    <code>date_sold = 1/1/1970</code>
  </td>
  <td>
    <code>You sold no items on 1/1/70.</code>
  </td>
  <td>
    <code>Vous avez vendu aucun objet le 01/01/1970.</code>
  </td>
</tr>

<tr>
  <td>
    <code>num_items = 1</code></br>
    <code>date_sold = 1/1/1970</code>
  </td>
  <td>
    <code>You sold 1 item on 1/1/70.</code>
  </td>
  <td>
    <code>Vous avez vendu 1 objet le 01/01/1970.</code>
  </td>
</tr>

<tr>
  <td>
    <code>num_items = 5</code></br>
    <code>date_sold = 1/1/1970</code>
  </td>
  <td>
    <code>You sold 5 items on 1/1/70.</code>
  </td>
  <td>
    <code>Vous avez vendu 5 objets le 01/01/1970.</code>
  </td>
</tr>

</table>

**Read the guide here: [ICU Guide](icu.md)**

## Substitutions

These define self-closing MiniMessage tags that can be used in translations, which are locale-independent.
These are useful for symbols like icons. Note that these are pre-parsed by MiniMessage into components,
instead of being inserted directly as text.

```yaml
substitutions:
  icon_info: "<gray>(!)"
  # you could use custom fonts from a resource pack here
  icon_coin: "<yellow>\uf801"

translations:
  en-US:
    welcome: "<icon_info> Welcome to the server!"
    balance: "Your balance: <icon_coin> {coins}"
```

```xml
<gray>(!)</gray> Welcome to the server!
```

```xml
Your balance: <yellow>\uf801</yellow> 50
```

## Styles

These define MiniMessage tags which apply a style to any content inside them. These are also locale-independent,
so they should be the preferred method for applying simple styling like color and decorations, since they can be
defined and updated in a single place, and it will be propagated to all other translations automatically.

```yaml
styles:
  style_info:
    # font: minecraft:default
    color: gray
    # obfuscated: false
    # bold: false
    # strikethrough: false
    # underlined: false
    # italic: false
  style_important:
    color: yellow

translations:
  en-US:
    friend_join: "<style_info>Your friend <style_important>{friend_name}</style_important> has joined!"
```

```xml
<gray>Your friend <yellow>TheFriend</yellow> has joined!</gray>
```
