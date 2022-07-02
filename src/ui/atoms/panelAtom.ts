import { atom } from 'jotai';

export enum Panel {
  None,
  Settings,
  Spellbook
}

export const panelAtom = atom<Panel>(Panel.None);
