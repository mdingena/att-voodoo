import { atom } from 'jotai';

export type Incantation = [string, string];

export const incantationsAtom = atom<Incantation[]>([]);
