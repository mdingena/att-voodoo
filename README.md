<p align="center">
  <img width="240" src="./src/ui/images/Voodoo.png" alt="Voodoo Logo" />
</p>

<h1 align="center">Voodoo — Magic mod for <i>A Township Tale</i></h3></h1>

<p align="center">
  <img alt="CodeQL" src="https://github.com/mdingena/att-voodoo/actions/workflows/codeql-analysis.yml/badge.svg" />
  <a href="CODE-OF-CONDUCT.md"><img alt="contributor covenant v2.0 adopted" src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" /></a>
</p>

---

# 🔮 What is Voodoo?

**Voodoo** is a community-made magic mod for [_A Township Tale_](https://townshiptale.com/), a VR MMORPG game.

**Voodoo** consists of a **Voodoo Client** application (the repository you're looking at right now), [**Voodoo Server**](https://github.com/mdingena/att-voodoo-server), and a hidden **Voodoo Spellbook**.

**Voodoo Client** is a speech recognition application for _A Township Tale_ that lets you invoke magic spells with your voice on game servers that support **Voodoo**.

[**Voodoo Server**](https://github.com/mdingena/att-voodoo-server) is our bot that listens to all the **Voodoo Clients** out there and sends console commands to the servers they are playing on.

**Voodoo Spellbook** is a hidden repository that **Voodoo Server** uses to compare a list of spells to what players are invoking. Because the **Spellbook** is hidden, players need to discover the right combination of incantations and material components for each spell on their own!

# ⚠️ Known issues

- After acquiring a session in Voodoo, the app can sometimes jump back to the `Ready!` screen and get stuck here. [We're currently still investigating](https://github.com/mdingena/att-voodoo/issues/7) what is causing this.  
  **Work-around:** restart Voodoo.

# 🚀 Installation & usage

- [🕹️ Guide for players](./guides/PLAYERS.md)
- [🧰 Guide for server owners](./guides/SERVER-OWNERS.md)
- [✨ Casting spells](./guides/SPELLCASTING.MD)
- [📖 Spellbook](./spellbook/README.md)

# Maintainers

- [Marc Dingena](https://github.com/mdingena) (owner)

# Contributing

For bug fixes, documentation changes, and small features:

1. Fork this repository.
1. Create your feature branch (git checkout -b my-new-feature).
1. Commit your changes (git commit -am 'Add some feature').
1. Push to the branch (git push origin my-new-feature).
1. Create a new Pull Request.

**For larger new features**: Do everything as above, but first also make contact with the project maintainers to be sure your change fits with the project direction and you won't be wasting effort going in the wrong direction.
