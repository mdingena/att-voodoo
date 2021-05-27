import { atom } from 'jotai';

export enum AppStage {
  Loading,
  Splash,
  Ready,
  Authenticating,
  WaitingForServer,
  Connected
}

export const appStageAtom = atom<AppStage>(AppStage.Loading);
