import path from 'path';
import { ChildProcess, execFile } from 'child_process';
import { app, BrowserWindow, ipcMain } from 'electron';
import fetch from 'electron-fetch';
import isDev from 'electron-is-dev';
import { config as configEnv } from 'dotenv';
import { createDevToolsLogger } from './utils/createDevToolsLogger';

if (isDev) configEnv();
const voodooServerTokenApiUrl = isDev
  ? 'http://localhost:3000/session'
  : 'https://att-voodoo-server.herokuapp.com/session';
const voodooServerHeartbeatApiUrl = isDev
  ? 'http://localhost:3000/heartbeat'
  : 'https://att-voodoo-server.herokuapp.com/heartbeat';

app.removeAsDefaultProtocolClient('att-voodoo');

if (process.env.NODE_ENV === 'development' && process.platform === 'win32') {
  app.setAsDefaultProtocolClient('att-voodoo', process.execPath, [path.resolve(process.argv[1])]);
} else {
  app.setAsDefaultProtocolClient('att-voodoo');
}

const hasInstanceLock = app.requestSingleInstanceLock();
if (!hasInstanceLock) {
  app.quit();
}

let win: BrowserWindow | null = null;
let speech: ChildProcess | null = null;

const terminate = () => {
  win = null;
  speech?.kill();
  speech = null;
};

const createWindow = async (): Promise<void> => {
  win = new BrowserWindow({
    width: 1440,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    },
    show: false
  });

  const logger = createDevToolsLogger(win);

  if (isDev) {
    win.webContents.openDevTools();
  }

  await win.loadURL(isDev ? 'http://localhost:9000/#' : path.resolve(`file://${__dirname}/../../build/ui/index.html#`));

  win.on('closed', terminate);
  win.once('ready-to-show', () => win?.show());
  app.on('open-url', (_, data) => data.startsWith('att-voodoo://') && loadDeepLinkUrl(data));
  app.on('second-instance', async (_, cliArgs) => {
    const url = findDeepLinkUrl(cliArgs);
    logger(url);
    url && loadDeepLinkUrl(url);
  });
};

const findDeepLinkUrl = (deeplink: string[]) => deeplink.find(arg => arg.startsWith('att-voodoo://'));

const loadDeepLinkUrl = (deeplink: string): void => {
  const url: string = deeplink?.replace('att-voodoo://', '');

  const loadURL = isDev
    ? `http://localhost:9000/#/${url}`
    : `${path.resolve(`file://${__dirname}/../../build/ui/index.html`)}#/${url}`;

  console.log({ loadURL });
  setTimeout(() => {
    win?.loadURL(loadURL);
  }, 1000);
};

const startListening = async (): Promise<void> => {
  const exePath = isDev
    ? path.join(__dirname, '../../build/speech/VoodooListener.exe')
    : path.join(process.resourcesPath, 'speech/VoodooListener.exe');

  speech = await execFile(exePath);

  speech.on('exit', exitCode => win?.webContents.send('speechExited', { exitCode }));
  speech.stderr?.on('data', error => win?.webContents.send('speechError', { error }));
  speech.stdout?.on('data', data => win?.webContents.send('speechData', { data }));
};

const initialiseApp = async (): Promise<void> => {
  await createWindow();
  startListening();
};

app.on('ready', initialiseApp);

let heartbeatHandle: NodeJS.Timer | null = null;
const heartbeatInterval = 60000;

type HeartbeatResponse = {
  ok: boolean;
  error?: string;
};

const heartbeat = async (accessToken: string): Promise<HeartbeatResponse> => {
  try {
    const response = await fetch(voodooServerHeartbeatApiUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status !== 200 || !response.ok) return { ok: false, error: response.statusText };

    return await response.json();
  } catch (error) {
    return { ok: false, error: error.code };
  }
};

ipcMain.handle('session', async (_, { accessToken }) => {
  try {
    const response = await fetch(voodooServerTokenApiUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status !== 200 || !response.ok) return { ok: false, error: response.statusText };

    if (heartbeatHandle === null) {
      heartbeatHandle = setInterval(() => {
        heartbeat(accessToken);
      }, heartbeatInterval);
    }

    return await response.json();
  } catch (error) {
    return { ok: false, error: error.code };
  }
});
