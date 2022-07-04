import { atom } from 'jotai';

export enum StudyFeedback {
  Match = 'MATCH',
  Partial = 'PARTIAL',
  Mismatch = 'MISMATCH'
}

type Feedback = StudyFeedback | undefined;

export type Incantation = [string, string, Feedback];

export const incantationsAtom = atom<Incantation[]>([]);
