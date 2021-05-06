# 🔮 Voodoo Client

**Voodoo** is a community-made magic mod for [_A Township Tale_](https://townshiptale.com/), a VR MMORPG game.

**Voodoo** consists of a **Voodoo Client** application (the repository you're looking at right now), [**Voodoo Server**](https://github.com/mdingena/att-voodoo-server), and a hidden **Voodoo Spellbook**.

**Voodoo Client** is a speech recognition application for _A Township Tale_ that lets you invoke magic spells with your voice on game servers that support **Voodoo**.

[**Voodoo Server**](https://github.com/mdingena/att-voodoo-server) is our bot that listens to all the **Voodoo Clients** out there and sends console commands to the servers they are playing on.

**Voodoo Spellbook** is a hidden repository that **Voodoo Server** uses to compare a list of spells to what players are invoking. Because the **Spellbook** is hidden, players need to discover the right combination of incantations and material components for each spell on their own!

# 🚀 Installation & usage

<details>
<summary>🕹️ Guide for players</summary>

🚧 Installation details unknown yet. Stay tuned for future updates.

See [Casting spells](#-casting-spells) for details on how to use Voodoo magic.

</details>

<details>
<summary>👩‍🔧 Guide for server owners</summary>

Adding Voodoo to your server is really easy!

1. Launch the game.
1. Pull up your server's management panel in the Overworld.
1. Invite `Voodoo Mod` to join your server group.
1. In the Launcher, assign `Voodoo Mod` to the `Owner` role.
1. (optional) Place a **Spellcrafting Conduit** (`Green_Crystal_cluster_03` prefab) somewhere in town. You may skip this step, forcing players to invoke their spells in the crystal layers of the mines. Make sure players are able to stand within 4 meters of the conduit.

Our bot will connect to your server automatically and your players will now be able to use Voodoo on your server.

### Who is Voodoo Mod?

`Voodoo Mod` is our bot account. It's an account that allows `Voodoo Mod` to connect to servers as a player with a role, which is required to let bots send console commands.

### Why does the `Voodoo Mod` account need `Owner` privileges?

`Voodoo Mod` needs to have the correct privileges to enable sending console commands to your server. If `Voodoo Mod` cannot send console commands, players will not be able to use Voodoo magic.

### What sort of console commands does Voodoo send to my server?

Players will not be able to dictate which console commands are sent to your server. Players using Voodoo can only send predefined requests to our bot, which translates the request to the actual console commands. These commands are used to **spawn** and **destroy** items on your server, but only items stored in the player's inventory are destroyed. This happens when players cast a spell that requires material components to be stored in their belt slots.

Generally speaking, players will not be able to create a high volume of items out of thin air. Voodoo spells require material components, so to create new items, other items must be consumed first. This greatly reduces the rate at which players can potentially spam your server with items.

</details>

# 👩‍🎓 Casting spells

Casting spells requires your patience and resources.

First, to **invoke** a spell you must be near a **Spellcrafting Conduit**, speak a series of incantations and—in most cases—offer an array of different material components to be destroyed in the process.

Depending on the type of the spell, a successful **invocation** may either **cast** that spell immediately or **prepare** it in your mind with a fast trigger for casting later.

## Instant spells

Instant spells are cast **immediately** after successfully invoking them. Most utility spells—such as spells from the _transmutation_ and _conjuration_ schools—are instant spells.

Instant spells do not require an available spell preparation slot.

## Prepared spells

Prepared spells are **stored** in a spell preparation slot after successfully invoking them. Most combat spells are prepared spells. You must prepare these spells near a **Spellcrafting Conduit**, but once prepared, you may go anywhere and cast it by speaking the spell's fast trigger phrase.

## Spellcrafting Conduits

Voodoo magic is very strong near emerald beryl, which are green crystals found in large cluster formations deep in the mines. Emerald beryl acts as a conduit for invoking Voodoo spells, and you must be near one of these clusters to access its power and invoke spells.

Some towns have hauled these crystals from the mines and erected **Spellcrafting Conduits** around town for easier access to Voodoo magic.
