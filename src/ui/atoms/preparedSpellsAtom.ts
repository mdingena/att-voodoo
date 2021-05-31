import { atom } from 'jotai';

export type PreparedSpell = {
  name: string;
  verbalTrigger: string;
};

export const preparedSpellsAtom = atom<PreparedSpell[]>([]);
