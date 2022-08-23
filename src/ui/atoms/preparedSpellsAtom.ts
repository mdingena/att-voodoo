import { atom } from 'jotai';

export type PreparedSpell = {
  name: string;
  school?: string;
  /* School is optional because it was added in a later patch. */
  /* Some players might have prepared spells in the DB without school data. */
  verbalTrigger: string;
  charges: number;
};

export const preparedSpellsAtom = atom<PreparedSpell[]>([]);
