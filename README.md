<p align="center">
  <img width="240" src="./src/ui/images/Voodoo.png" alt="Voodoo Logo" />
</p>

<h1 align="center">Voodoo — Magic mod for <i>A Township Tale</i></h3></h1>

<p align="center">
  <img alt="CodeQL" src="https://github.com/mdingena/att-voodoo/actions/workflows/codeql-analysis.yml/badge.svg" />
</p>

---

# 🔮 What is Voodoo?

**Voodoo** is a community-made magic mod for [_A Township Tale_](https://townshiptale.com/), a VR MMORPG game.

**Voodoo** consists of a **Voodoo Client** application (the repository you're looking at right now), [**Voodoo Server**](https://github.com/mdingena/att-voodoo-server), and a hidden **Voodoo Spellbook**.

**Voodoo Client** is a speech recognition application for _A Township Tale_ that lets you invoke magic spells with your voice on game servers that support **Voodoo**.

[**Voodoo Server**](https://github.com/mdingena/att-voodoo-server) is our bot that listens to all the **Voodoo Clients** out there and sends console commands to the servers they are playing on.

**Voodoo Spellbook** is a hidden repository that **Voodoo Server** uses to compare a list of spells to what players are invoking. Because the **Spellbook** is hidden, players need to discover the right combination of incantations and material components for each spell on their own!

# ⚠️ Known issues

- After acquiring a session in Voodoo, the app can sometimes jump back to the `Ready!` screen and get stuck here. We're currently still investigating what is causing this.  
  **Work-around:** restart Voodoo.

# 🚀 Installation & usage

- [🕹️ Guide for players](./guides/PLAYERS.md)
- [🧰 Guide for server owners](./guides/SERVER-OWNERS.md)
- [✨ Casting spells](./guides/SPELLCASTING.MD)
