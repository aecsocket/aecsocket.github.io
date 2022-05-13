---
sidebar_position: 2
---

# ICU Templates

Guide on how to write ICU templates.

## Preface

The official Unicode ICU is very verbose, and takes a lot of effort to understand properly.
This document aims to provide a simpler guide to ICU than is available elsewhere.

You can find ICU documentation on https://unicode-org.github.io/icu/userguide/.

## Templates

A template is a block in your format that will be replaced by an argument specified from code.

```icu-message-format
New messages: {new_messages, number}
```

The `{new_messages, number} block will be replaced by whatever value is passed in:

using `new_messages = 5`:
```
New messages: 5
```

## Types

When defining a template, you can optionally define what type of value it will be displayed
as:

| Type | Display as... | Example |
|------|-------------|---------|
| (none) | a raw piece of text | `You got a friend request from {username}` |
| `number` | a number, with separators and other features based on the language | `You have {followers, number} followers` |
| `date` | a point in time | `You first joined on {first_join, date}` |

For each type, you can define some extra parameters.

### Number

You can combine these together, e.g. `% .00`

#### Precision

Define how many decimal places the number will be formatted up to, handling rounding.

```icu-message-format
Result of calculation: {result, number, .00}
```

using `result = 12.7777`:
```
Result of calculation: 12.78
```

using `result = 12`:
```
Result of calculation: 12.00
```

#### Percent

Format the number as a percentage - numbers between 0 and 1 will be converted to between
0 and 100.

```icu-message-format
Progress: {progress, number, %}
```

using `progress = 0.5`
```
Progress: 50%
```

#### Unit

Format the number as a unit.

```icu-message-format
This item is {length, number, unit/meter} long
```

using `length = 5`
```
This item is 5 m long
```

#### Currency

Format the number as a specified currency. Note that this does *not* do currency conversions,
just formats a number as the currency.

```icu-message-format
This item costs {cost, number, currency/CAD}
```

using `cost = 10`
```
This item costs CA$10.00
```

### Date

Specify these after the `date`, e.g. `{the_date, date, short}`:

| Format | Description | Example |
|--------|-------------|---------|
| `short` | Numeric | `12/13/52` |
| `medium` | Written short | `Jan. 12, 1952` |
| `long` | Written long | `January 12, 1952` |
| `full` | All details | `Tuesday, April 12, 1952 AD` |

## Plurals

If an argument is provided as a number, you can output a different message depending
on the number, and how the language handles plurals:

```icu-message-format
You have {cart_items, plural,
  one {# item}
  other {# items}
} in your shopping cart.
```

```
You have 3 items in your shopping cart.
You have 1 item in your shopping cart.
```

The different quantifiers you can specify are:
- `zero`
- `one`
- `two`
- `few`
- `many`
- `other` - required
- `=[a number]` - for a specific number, e.g. `=1`. Use the above types if possible.

## Selection

You can change the output depending on the text value of another argument:

```icu-message-format
{user_name} just joined a game, join {user_gender, select,
  male {him}
  female {her}
  other {them}
}!
```

Depending on the value passed to `user_gender`, a different message is used here:

using `user_gender = "male"`
```
SomeMaleUser just joined a game, join him!
```

using `user_gender = "female"`
```
SomeFemaleUser just joined a game, join her!
```

You can also access the actual value passed to the selected argument inside the block:

```icu-message-format
You entered {world_type, select,
  easy {an Easy}
  hard {a Hard}
  other {the {world_type}}
} world!
```

using `world_type = "easy"`
```
You entered an Easy world!
```

using `world_type = "Impossible"`
```
You entered the Impossible world!
```
