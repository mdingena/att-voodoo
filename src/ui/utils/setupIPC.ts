import { ipcMain, BrowserWindow } from 'electron';
import { ChildProcess } from 'child_process';
import fetch from 'electron-fetch';
import { startListening } from './startListening';
import { heartbeat } from './heartbeat';
import config from '../config';

let heartbeatHandle: NodeJS.Timer | null = null;
const heartbeatInterval = 60000;

export const setupIPC = (ui: BrowserWindow | null, speech: ChildProcess | null, logger: (...args: any) => void) => {
  ipcMain.handle('session', async (_, { accessToken }) => {
    try {
      const response = await fetch(config.API_ENDPOINTS.SESSION, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.status !== 200 || !response.ok) return { ok: false, error: response.statusText };

      if (heartbeatHandle === null) {
        startListening(ui, speech, logger);

        heartbeatHandle = setInterval(() => {
          heartbeat(accessToken);
        }, heartbeatInterval);
      }

      return await response.json();
    } catch (error) {
      return { ok: false, error: error.code };
    }
  });
};
