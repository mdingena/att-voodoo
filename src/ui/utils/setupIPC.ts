import { ipcMain, BrowserWindow } from 'electron';
import { ChildProcess } from 'child_process';
import { startListening } from './startListening';
import { heartbeat } from './heartbeat';
import { voodooGet } from './voodooGet';
import config from '../config';

type HeartbeatDelay = { current: number };

let heartbeatHandle: NodeJS.Timer | null = null;

export const scheduleHeartbeat = (accessToken: string, delay: HeartbeatDelay) => {
  return setTimeout(() => {
    heartbeat(accessToken);
    heartbeatHandle = scheduleHeartbeat(accessToken, delay);
  }, delay.current);
};

export const setupIPC = (ui: BrowserWindow | null, speech: ChildProcess | null, logger: (...args: any) => void) => {
  ipcMain.handle('session', async (_, { accessToken }) => {
    const response = await voodooGet(accessToken, config.API_ENDPOINTS.SESSION);

    if (response.ok) {
      if (heartbeatHandle === null) {
        startListening(ui, speech, accessToken, logger);

        heartbeatHandle = scheduleHeartbeat(accessToken, config.INTERVALS);
      }
    }

    return response;
  });
};
