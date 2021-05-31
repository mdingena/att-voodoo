import { atom } from 'jotai';
import { Prefab } from '@/prefabs';

export type Incantation = [string, Prefab];

export const incantationsAtom = atom<Incantation[]>([]);
