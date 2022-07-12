import { atom } from 'jotai';

export type SpellUpgrades = { [upgradeKey: string]: number };

type Upgrades = {
  [spellKey: string]: SpellUpgrades;
};

export type Experience = {
  freeResets: number;
  upgrades: Upgrades;
  abjurationXpTotal: number;
  abjurationXpSpent: number;
  conjurationXpTotal: number;
  conjurationXpSpent: number;
  evocationXpTotal: number;
  evocationXpSpent: number;
  transmutationXpTotal: number;
  transmutationXpSpent: number;
};

export const experienceAtom = atom<Experience>({
  upgrades: {},
  abjurationXpTotal: 0,
  abjurationXpSpent: 0,
  conjurationXpTotal: 0,
  conjurationXpSpent: 0,
  evocationXpTotal: 0,
  evocationXpSpent: 0,
  transmutationXpTotal: 0,
  transmutationXpSpent: 0
});
