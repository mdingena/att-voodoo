# Voodoo Client

**Voodoo** is a community-made magic mod for [_A Township Tale_](https://townshiptale.com/), a VR MMORPG game.

**Voodoo** consists of a **Voodoo Client** application (the repository you're looking at right now), [**Voodoo Server**](https://github.com/mdingena/att-voodoo-server), and a hidden **Voodoo Spellbook**.

**Voodoo Client** is a speech recognition application for _A Township Tale_ that lets you invoke magic spells with your voice on game servers that support **Voodoo**.

# 🚀 Installation & usage

<details>
<summary>🕹️ Guide for players</summary>

🚧 Details unknown yet. Stay tuned for future updates.

</details>

---

<details>
<summary>👩‍🔧 Guide for server owners</summary>

Adding Voodoo to your server is really easy!

1. Launch the game.
1. Pull up your server's management panel in the Overworld.
1. Invite `Voodoo Mod` to join your server group.
1. In the Launcher, assign `Voodoo Mod` to the `Owner` role.

Our bot will connect to your server automatically and your players will now be able to use Voodoo on your server.

### Who is Voodoo Mod?

`Voodoo Mod` is our bot account. It's an account that allows `Voodoo Mod` to connect to servers as a player with a role, which is required to let bots send console commands.

### Why does the `Voodoo Mod` account need `Owner` privileges?

`Voodoo Mod` needs to have the correct privileges to enable sending console commands to your server. If `Voodoo Mod` cannot send console commands, players will not be able to use Voodoo magic.

### What sort of console commands does Voodoo send to my server?

Players will not be able to dictate which console commands are sent to your server. Players using Voodoo can only send predefined requests to our bot, which translates the request to the actual console commands. These commands are used to **spawn** and **destroy** items on your server, but only items stored in the player's inventory are destroyed. This happens when players cast a spell that requires material components to be stored in their belt slots.

Generally speaking, players will not be able to create a high volume of items out of thin air. Voodoo spells require material components, so to create new items, other items must be consumed first. This greatly reduces the rate at which players can potentially spam your server with items.

</details>
