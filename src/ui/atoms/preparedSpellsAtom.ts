import { atom } from 'jotai';

export type PreparedSpell = {
  name: string;
  verbalTrigger: string;
  charges?: number;
  /* Charges is optional because it was added in a later patch. */
  /* Some players might have prepared spells in the DB without charges. */
};

export const preparedSpellsAtom = atom<PreparedSpell[]>([]);
