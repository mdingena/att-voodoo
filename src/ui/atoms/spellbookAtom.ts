import { atom } from 'jotai';

export type School = 'abjuration' | 'conjuration' | 'evocation' | 'transmutation';

export type UpgradeConfig = {
  name: string;
  description: string;
  isStepFunction: boolean;
  min: number;
  max: number;
  constant: number;
  unit: string;
  units: string;
};

type UpgradeConfigs = {
  [key: string]: UpgradeConfig;
};

export type Spell = {
  name: string;
  school: School;
  requiresPreparation: boolean;
  upgrades: UpgradeConfigs;
};

type Spellbook = {
  [key: string]: Spell;
};

export const spellbookAtom = atom<Spellbook>({});
