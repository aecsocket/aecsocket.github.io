---
sidebar_position: 3
---

# Calibre

[GitHub](https://github.com/aecsocket/calibre) | [Dokka](pathname:///calibre/dokka/index.html)

---

Platform-agnostic, modular gun framework for Minecraft.

A true customisable gun framework, allowing unparalleled customisation through the use of the
[Sokol](https://github.com/aecsocket/sokol) item composition library. Complex gun tree nodes,
fire modes, multiple usable sights, ejecting shell casings...

## Features

### Sokol composition

Using the Sokol library, complex item trees can be designed, with isolatable behaviours:
* A laser pointer can show a laser, even if it's just in your hand and not attached to a gun
* Gun state can be stored such as durability, or a sight's battery life
* Attachments on attachments - it is a tree structure, after all

Read the [Sokol guide](/sokol) to learn more.

### Comparison to other plugins

| Feature | Crackshot | Calibre |
|---------|-----------|---------|
| Stand-alone system | ✓ | ✓ |
| Iron sights | ✓ | ✓ With multiple sights, and you can cycle through them |
| Dual wield | ✓ | ✓ With special handling for dual wielding guns |
| Attachments | ✓ | ✓ Attachments on attachments (tree structure) |
| Reloads | ✓ | ✓ Staged reloads, fire modes, single-shell loads/magazine loads, and more |
| Custom sounds | ✓ | ✓ Customisable sound dropoff, range, speed-of-sound simulation; specify sounds from a resource pack |
| Recipes | ✓ | No, but can be easily integrated with custom crafting plugins |
| Shops | ✓ | No, but can be easily integrated with shop plugins |
| Multi-world support | ✓ | *(unsure if permissions will be defined for MW) |
| Headshots | ✓ | *(through another plugin) |
| Backstabs | ✓ | ✓ |
| Function alongside kit/econ plugins | ✓ | ✓ |
| Riot shields | ✓ | No, feature bloat |
| Explosives | ✓ | ✓ Custom explosion engine |

| Feature | Crackshot Plus | Calibre |
|---------|----------------|---------|
| Trails | ✓ | ✓ Also impact particles, impact sounds, bullet whiz... |
| Projectile control | ✓ | No, feature bloat |
| Homing projectiles | ✓ | No, feature bloat |
| Bouncing projectiles | ✓ | ✓ Bouncing *anything* - grenades, bullets, anything can be customised |
| Bullet spread | ✓ | ✓ |
| Camera recoil | ✓ | ✓ Uses custom packet techniques to make very smooth recoil, with recoil recovery as well |
| Second zoom | ✓ | ✓ Can have as many zoom levels as you want |
| Break blocks | ✓ | (tbd) |
| Temporary turret | ✓ | No, feature bloat |
| Monkey bomb | ✓ | No - what? |
| Visual reload | ✓ | ✓ Animation engine and staged reloads |
| Weapon weight | ✓ | ✓ (in the sense that held guns can reduce walk speed) |
| Skin | ✓ | No, feature bloat |
| Attachments | ✓ | ✓ Much more detailed; attachments on attachments |
| Resource pack | ✓ | No; Calibre is a library, not a premade gun set |

| Feature | Quality Armory | Calibre |
|---------|----------------|---------|
| Weapons, ammo types | ✓ | No; Calibre is a library, not a premade gun set |
| Does not replace existing items | ✓ | ✓ |
| API | ✓ | ✓ Much better API |
| 1.9-1.16 | ✓ | No, latest version only |
| Muzzle flashes | ✓ | ✓ No need for LightAPI: can do native muzzle flashes |
| Weapon durability | ✓ | ✓ In-depth maintenance system |
| Shop and crafitng recipes | ✓ | No, can be added through other plugins |
| Fully configurable | ✓ | ✓ Way more |

| Feature | Other plugins | Calibre |
|---------|---------------|---------|
| Node tree, composition based approach | No | ✓ |
| (by extension) Attachments on attachments | No | ✓ |
| Minimalist design principle | No | ✓ |
| Localization support for any language | No | ✓ |
| Fire modes | No | ✓ |
| Multiple selectable sights | No | ✓ |
| Manually chambering guns e.g. bolt-actions, pump-actions | No | ✓ |
| Tick-perfect 20hz firing | No | ✓ |
| Viewmodel-style barrel offsets from camera | No | ✓ |
| Sight in guns - zeroing at a specific range | No | ✓ |
| Bullet impact particles, sounds, bullet whiz | No | ✓ |
| Shooting attracts hostile mobs | No | ✓ |
| Block, armor, entity penetration | No | ✓ |
| Visible shell casings ejected | No | ✓ |
| Cookable grenades | No | ✓ |
| Aim sway (scope migration) | No | ✓ |
| | |
| Built with code cleanliness in mind | No | ✓ |
| In-depth API | No | ✓ |
| **FREE** | Some | ✓ |
| **OPEN-SOURCE** | No | ✓ |

## Note on usage

Calibre is not designed to be a drop-in replacement for any other gun library. Setting up a gun's
behaviour in Calibre takes a lot of configuration work, and there is no migration path from other
plugins. Despite the initial complexity, the payoff is that much more complex options are possible.

Developers are also encouraged to extend Calibre through Sokol's feature systems, and being able to
listen to and hook into Calibre's gun events.
