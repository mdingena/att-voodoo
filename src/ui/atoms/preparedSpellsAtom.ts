import { atom } from 'jotai';
import { Incantation } from './incantationsAtom';

export type PreparedSpell = {
  name: string;
  verbalTrigger: string;
  incantations: Incantation[];
};

export const preparedSpellsAtom = atom<PreparedSpell[]>([]);
