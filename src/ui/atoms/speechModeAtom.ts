import { atom } from 'jotai';

export enum SpeechMode {
  Locked,
  Suppressed,
  Awake,
  Incanting,
  Energizing,
  Conjuring
}

export const speechModeAtom = atom<SpeechMode>(SpeechMode.Suppressed);
