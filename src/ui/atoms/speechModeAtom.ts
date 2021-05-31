import { atom } from 'jotai';

export enum SpeechMode {
  Suppressed,
  Awake,
  Incanting
}

export const speechModeAtom = atom<SpeechMode>(SpeechMode.Suppressed);
