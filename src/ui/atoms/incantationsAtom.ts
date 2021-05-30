import { atom } from 'jotai';

export type Incantation = [string, number];

export const incantationsAtom = atom<Incantation[]>([]);
