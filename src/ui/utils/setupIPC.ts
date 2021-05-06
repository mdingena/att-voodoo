import { ipcMain, BrowserWindow } from 'electron';
import { ChildProcess } from 'child_process';
import { startListening } from './startListening';
import { heartbeat } from './heartbeat';
import { voodooGet } from './voodooGet';
import config from '../config';

let heartbeatHandle: NodeJS.Timer | null = null;
const heartbeatInterval = 60000;

export const setupIPC = (ui: BrowserWindow | null, speech: ChildProcess | null, logger: (...args: any) => void) => {
  ipcMain.handle('session', async (_, { accessToken }) => {
    const response = await voodooGet(accessToken, config.API_ENDPOINTS.SESSION);

    if (response.ok) {
      if (heartbeatHandle === null) {
        startListening(ui, speech, logger);

        heartbeatHandle = setInterval(() => {
          heartbeat(accessToken);
        }, heartbeatInterval);
      }
    }

    return response;
  });
};
