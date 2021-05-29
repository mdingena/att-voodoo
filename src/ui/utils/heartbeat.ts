import { BrowserWindow } from 'electron';
import { Servers } from '@/atoms/serversAtom';
import { voodooGet } from './voodooGet';
import config from '../config';

type SuccessfulHeartbeat = {
  ok: true;
  result: {
    playerJoined: number | null;
    servers: Servers;
  };
};

type FailedHeartbeat = {
  ok: false;
  error: string;
};

type HeartbeatResponse = SuccessfulHeartbeat | FailedHeartbeat;

export const heartbeat = async (ui: BrowserWindow | null, accessToken: string): Promise<void> => {
  let response: HeartbeatResponse;

  try {
    response = await voodooGet(accessToken, config.API_ENDPOINTS.HEARTBEAT);
  } catch (error) {
    response = { ok: false, error: error.message };
  }

  if (response.ok) {
    ui?.webContents.send('update-servers', response.result);
  }
};
