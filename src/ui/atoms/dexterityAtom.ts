import { atom } from 'jotai';

export type EvokeHandedness = 'left' | 'right';

export type EvokeAngle = 'palm' | 'index';

export const dexterityAtom = atom<[EvokeHandedness, EvokeAngle]>(['right', 'palm']);
