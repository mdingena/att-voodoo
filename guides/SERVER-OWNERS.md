# 🧰 Guide for server owners

Adding Voodoo to your server is really easy!

1. Open your Alta Launcher.
1. Open your server group panel in the right sidebar.
1. At the bottom of the sidebar, invite **`Voodoo Mod`** to join your server group.
1. **Voodoo Mod** will accept your invite immediately. Click your server group icon again to refresh your members list.
1. Find **Voodoo Mod** in your members list and click the <kbd>Make Moderator</kbd> button.
1. (optional) Place a **Spellcrafting Conduit** (`Green_Crystal_cluster_03` prefab) somewhere in town. You may skip this step, forcing players to invoke their spells in the crystal layers of the mines. Make sure players are able to stand within 10 metres of the conduit.

Our bot will connect to your server automatically and your players will now be able to use Voodoo on your server.

### Who is **Voodoo Mod**?

**Voodoo Mod** is our bot account, and will show up in your server group members list with a `BOT` label. It's an account that allows **Voodoo Mod** to connect to servers as a player with a moderator role, which is required to let bots send console commands.

### Why does **Voodoo Mod** need moderator privileges?

**Voodoo Mod** needs to have the correct privileges to enable sending console commands to your server. By default, server groups have a Moderator role that has console privileges. If **Voodoo Mod** cannot send console commands, players will not be able to use Voodoo magic.

### What sort of console commands does **Voodoo Mod** send to my server?

Players will not be able to dictate which console commands are sent to your server. Players using Voodoo can only send predefined requests to our bot, which translates the request to the actual console commands. These commands are used to **spawn** and **destroy** items on your server, but only items stored in the player's inventory are destroyed. This happens when players cast a spell that requires material components to be stored in their belt slots.

Generally speaking, players will not be able to create a high volume of items out of thin air. Voodoo spells require material components, so to create new items, other items must be consumed first. This greatly reduces the rate at which players can potentially spam your server with items.

| ℹ️  | Please [create a new issue](https://github.com/mdingena/att-voodoo/issues/new) if you're having problems with players abusing the system. |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------- |
