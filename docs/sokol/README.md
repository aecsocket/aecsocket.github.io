---
sidebar_position: 2
---

# Sokol

[GitHub](https://github.com/aecsocket/sokol) | [Dokka](pathname:///sokol/dokka/index.html)

---

Platform-agnostic, data-driven item framework for Minecraft.

Sokol provides developers and server admins the freedom to create scalable custom entities defined by
a data-driven composition approach, rather than the typical approach of one item correlating to one
function.

Entities in this context are defined as anything that can store state within a Minecraft world - be it
an item, block, or mob. Any of these can take in events from the world - such as a player right-clicking
with an item in hand - and in turn, run actions on the world and modify itself.

## Features

### Hosts

Each entity that can store state is referred to as a **host**, in the sense that it can host the
**node tree** which defines how it respons to events. Many parts of a game world can act as hosts, such as:
* Minecraft entities (e.g. animals, players)
* Stateful blocks (e.g. chests, furnaces)
* Items

These hosts can take in events from the world:
* A player right-clicks with an item in hand
* A block is broken
* A single game tick occurs (20 times per second)
  * Note: this includes every loaded item in the game - any items in chests, shulkers, entities, etc. will be ticked
  * This is achieved through the **host resolver** system

In turn, these hosts pass these events down to the node tree, which then acts on these events.

### Host resolver

Each game tick (20 times per second), the **host resolver** aims to find all loaded hosts in the world, and attempt to run a tick event on them. At the broadest level, each world and entity in the server is resolved as a possible host. Deeper down, each item stack in:
* each thrown item
* each player's current inventory cursor
* each entity's equipment
* each player's inventory
* each chest and container's inventort
* each shulker box in all of the above
is resolved as a possible host. For each of these hosts, if they hold a node tree, that tree will be ticked.
This allows developers to write systems that they can be sure can't be exploited by putting items somewhere else (think of an irradiated item - it can apply radiation not only when a player holds one, but even when it's placed in a chest or the world)

A note on performance: The host resolver attempts to take minimal action where possible, to reduce the performance overhead of such a system. In this spirit, only nodes which are marked as "ticking" will be ticked, and internal methods are used to reduce the overhead of reading the item data. This may break between game versions!

### Components

Server admins define components in the Sokol configuration, which determine the component's:
* behaviour - through **feature profiles**
* stats - through the **stat map**
* children the component accepts - through **slots**
* user-defined labels - through **tags**

```json5
wooden_sword_grip: {
  tags: [ "sword_grip" ]
  features: {
    sword_attack: {}
  }
  stats: [
    {
      "sword_attack:swing_delay": 0.5
      "sword_attack:swing_reach": 3.0
    }
  ]
  slots: {
    guard: {
      required: true
      rule: [ "tagged", "sword_guard" ]
    }
    blade: {
      required: true
      rule: [ "tagged", "sword_blade" ]
    }
  }
}

iron_sword_blade: {
  tags: [ "sword_blade" ]
  stats: {
    damage: 7
  }
  slots: {
    blade_wrapping: { rule: [ "tagged", "sword_blade_wrapping" ] }
  }
}
```

#### Feature profiles

**Features** are the actual pieces of code that run actions in response to events. **Feature profiles**
are defined on components to configure exactly how features respond to events.

#### Stat map

**Stats** are pieces of data that are global to an entire node tree. These are useful for sharing data
that can be modified by other features, e.g. the damage of a sword.

#### Slots

**Slots** on a component define how many children the resulting node from a component can hold, and type
of nodes exactly can go into these slots. These use a rule-based system for determining compatibility
of nodes.

#### Tags

**Tags** are pieces of text that can be assigned to components, and are used to categorise them.
A slot's rule can check if a component has a specific tag, to check if that component can be added as
a child to another component.

### Node tree design

Each host can store a **node tree**, which is a tree structure of nodes. Each individual **data node**
is backed by a component, defining the features profiles and slots, and also stores the current
**feature data** for each feature, and the node's **child nodes**.

```json5
// node for the component `wand_base`
id: "wand_base"
features: {
  wand: {
    cooldown: 3500 // milliseconds
  }
}
children: {

  grip: "iron_wand_grip"

  power_source: {
    // node for the component `blue_power_crystal`
    id: "blue_power_crystal"
    features: {
      wand_power_source: {
        charge: 75
      }
    }
  }

}
```

#### Feature data

**Feature data** can be thought of as the data that your node stores when it's saved into the world, e.g. into an item.
This data is stored in the world itself, persists between restarts, and the feature is free to do what it likes with this data.
For example, a wand's power crystal's charge can be stored through feature data:

```json5
id: "blue_power_crystal"
features: {
  wand_power_source: {
    charge: 75
  }
}
```

#### Children

Since it is a node structure, each node can have **children**. This is simply a logical grouping of
a set of nodes under a parent node.

* `wand_base` - the root of the tree node
  * for slot `grip`, node for component `iron_wand_grip`
  * for slot `power_source`, node for component `blue_power_crystal`

These can be as complex as you like, allowing you to make items akin to Escape from Tarkov's complex
gun trees:

![M4A1 build from Escape from Tarkov](https://webf-store.escapefromtarkov.com/uploads/monthly_2018_02/5a92d3980294b_2018-02-2510-12(0).png.9a0fe484b2fa2daebb715d51265896f1.png)

* M4A1 receiver
  * Colt buffer tube
    * MOE Stock
  * OMRG pistol grip
  * M4A1 upper receiver
    * 260mm barrel
      * Hybrid 46 suppressor
    * LVOA-S handguard
      * LS321 laser sight

and so on...

## Compared to other libraries

Sokol is not designed to be a drop-in replacement for other plugins such as Oraxen or ItemAdder.
Sokol's scope is not limited to items (node trees can be stored on anything that holds persistent
data, such as worlds themselves), and the default features provided in Sokol are not designed for admins
to configure items to do functions like summon lightning.

Instead, Sokol has the focus of being a barebones library for other mods and plugins to expand on,
allowing these plugins to define features which in turn can be used by server admins to set up their
custom items, etc.

Sokol was originally part of a larger plugin, [Calibre](https://github.com/aecsocket/calibre) -
a modular gun plugin - howeverwas split off to maintain the "custom behaviour" part independently. To
see an example of how Sokol can be used to design functional custom items, see Calibre.
