import { atom } from 'jotai';

export type School = 'abjuration' | 'conjuration' | 'evocation' | 'transmutation';

type UpgradeConfig = {
  [key: string]: {
    name: string;
    description: string;
    isStepFunction: boolean;
    min: number;
    max: number;
    constant: number;
  };
};

type Spellbook = {
  [key: string]: {
    name: string;
    school: School;
    requiresPreparation: boolean;
    upgrades: UpgradeConfig;
  };
};

export const spellbookAtom = atom<Spellbook>({});
