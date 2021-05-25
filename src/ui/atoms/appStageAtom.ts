import { atom } from 'jotai';

export enum AppStage {
  Anonymous,
  Authenticating,
  WaitingForServer,
  Ready
}

export const appStageAtom = atom<AppStage>(AppStage.Anonymous);
