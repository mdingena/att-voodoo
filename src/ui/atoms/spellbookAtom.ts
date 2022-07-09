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

type SpawnFrom = 'eyes' | 'mainHand' | 'offHand' | 'bothHands';

export type Spell = {
  name: string;
  school: School;
  description: string;
  castsFrom?: SpawnFrom;
  requiresPreparation: boolean;
  upgrades: UpgradeConfigs;
  incantations?: [string, string][];
};

type Spellbook = Record<string, Spell>;

export const spellbookAtom = atom<Spellbook>({});
