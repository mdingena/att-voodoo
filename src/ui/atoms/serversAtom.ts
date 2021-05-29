import { atom } from 'jotai';

type ServerInfo = {
  id: number;
  name: string;
  online: boolean;
  players: number;
};

export type Servers = ServerInfo[];

export const serversAtom = atom<Servers>([]);
