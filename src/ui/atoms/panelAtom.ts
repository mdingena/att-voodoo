import { atom } from 'jotai';

export enum Panel {
  None,
  Settings,
  Upgrades
}

export const panelAtom = atom<Panel>(Panel.None);
