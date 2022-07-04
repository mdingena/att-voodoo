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

type CommonSpell = {
  name: string;
  school: School;
  description: string;
  castsFrom?: string;
  requiresPreparation: boolean;
  upgrades: UpgradeConfigs;
};

type DiscoveredSpell = CommonSpell & {
  isDiscovered: true;
  incantations: [string, string][];
};

type UndiscoveredSpell = CommonSpell & {
  isDiscovered: false;
  incantations?: never;
};

export type Spell = DiscoveredSpell | UndiscoveredSpell;

type Spellbook = Record<string, Spell>;

export const spellbookAtom = atom<Spellbook>({});
