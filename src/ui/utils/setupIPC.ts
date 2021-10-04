import { ipcMain, BrowserWindow } from 'electron';
import { ChildProcess } from 'child_process';
import { startListening } from './startListening';
import { handleSpeech } from './handleSpeech';
import { heartbeat } from './heartbeat';
import { voodooGet } from './voodooGet';
import { voodooPost } from './voodooPost';
import config from '../config';

type HeartbeatDelay = { current: number };

let heartbeatHandle: NodeJS.Timeout | null = null;

export const scheduleHeartbeat = (ui: BrowserWindow | null, accessToken: string, delay: HeartbeatDelay) => {
  return setTimeout(() => {
    /**
     * The heartbeat checks in which server you are playing.
     * It also get a cached copy of the server list with number of players.
     * This copy is refreshed server-side independently of these heartbeats.
     */

    heartbeat(ui, accessToken);
    heartbeatHandle = scheduleHeartbeat(ui, accessToken, delay);
  }, delay.current);
};

export const setupIPC = async (
  ui: BrowserWindow | null,
  speech: ChildProcess | null,
  logger: (...args: unknown[]) => void
): Promise<void> => {
  /* Start listening. */
  const speechProcess = await startListening(ui, speech, logger);

  /* Handle session creation. */
  ipcMain.handle('session', async (_, { accessToken }) => {
    const [sessionResponse, spellbookResponse] = await Promise.all([
      voodooGet(accessToken, config.API_ENDPOINTS.SESSION),
      voodooGet(accessToken, config.API_ENDPOINTS.SPELLBOOK)
    ]);

    if (sessionResponse.ok) {
      if (heartbeatHandle === null) {
        /* Handle Voodoo speech recognition. */
        speechProcess?.stdout?.on('data', speech => {
          handleSpeech(ui, speech, accessToken, logger);
        });

        heartbeatHandle = scheduleHeartbeat(ui, accessToken, config.INTERVALS);
      }
    }

    return {
      session: sessionResponse,
      spellbook: spellbookResponse
    };
  });

  /* Handle player update. */
  ipcMain.handle('update-player', async (_, { accessToken }) => {
    return await voodooGet(accessToken, config.API_ENDPOINTS.PLAYER);
  });

  /* Handle spell upgrade. */
  ipcMain.handle('upgrade', async (_, { accessToken, school, spellKey, upgradeKey }) => {
    return await voodooPost(accessToken, config.API_ENDPOINTS.UPGRADE, {
      school,
      spell: spellKey,
      upgrade: upgradeKey
    });
  });

  /* Handle UI focus. */
  ipcMain.handle('focus', () => ui?.focus());
};
