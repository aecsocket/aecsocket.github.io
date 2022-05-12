---
sidebar_position: 2
---

# Concepts

The basic concepts of Glossa.

## Translations

At its core, a **translation operation** is a lookup in a key-value map, where strings map
to lists of strings: `Map<String, List<String>>`. However, **internationalization (I18N)**
services provided by Glossa will do processing on these, to add features like **scopes**
and **substitutions**.

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
is used across many different applications. You can find a more complete guide on ICU
features on the [ICU format](icu) page.

```
On 12/02/19, OneOfYourFollowers started following you.
You now have 184 followers.
```

## Scopes

A scope is a block in a translation that can be used for various different features. One of
the most important uses of scopes is for repeating arguments:

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

You can also nest scopes:

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

You can define separators, which are added in between each repetition:

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
