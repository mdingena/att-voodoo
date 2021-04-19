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

const createWindow = async (): Promise<any> => {
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

  win.on('closed', terminate);
  win.once('ready-to-show', () => win?.show());
  app.on('open-url', (_, data) => data.startsWith('att-voodoo://') && loadDeepLinkUrl(data));
  app.on('second-instance', async (_, cliArgs) => {
    const url = findDeepLinkUrl(cliArgs);
    logger(url);
    url && loadDeepLinkUrl(url);
  });

  await win.loadURL(
    isDev ? 'http://localhost:9000/#' : `file://${path.resolve(__dirname, '../../build/ui/index.html')}#`
  );

  return logger;
};

const findDeepLinkUrl = (deeplink: string[]) => deeplink.find(arg => arg.startsWith('att-voodoo://'));

const loadDeepLinkUrl = (deeplink: string): void => {
  const url: string = deeplink?.replace('att-voodoo://', '');

  const loadURL = isDev
    ? `http://localhost:9000/#/${url}`
    : `file://${path.resolve(__dirname, '../../build/ui/index.html')}#/${url}`;

  console.log({ loadURL });
  setTimeout(() => {
    win?.loadURL(loadURL);
  }, 1000);
};

const startListening = async (logger: any): Promise<void> => {
  const exePath = isDev
    ? path.resolve(__dirname, '../../build/speech/VoodooListener.exe')
    : path.resolve(process.resourcesPath, 'speech/VoodooListener.exe');

  const exeArgs = [
    isDev
      ? path.resolve(__dirname, '../../build/speech/grammar.xml')
      : path.resolve(process.resourcesPath, 'speech/grammar.xml')
  ];

  speech = await execFile(exePath, exeArgs);

  speech.on('exit', exitCode => {
    console.log('### SPEECH EXIT CODE', exitCode);
    win?.webContents.send('speechExited', { exitCode });
  });
  speech.stderr?.on('data', error => {
    console.log('### SPEECH ERROR', error);
    win?.webContents.send('speechError', { error });
  });
  speech.stdout?.on('data', data => {
    console.log('### SPEECH DATA', data);
    win?.webContents.send('speechData', { data });
  });
};

const initialiseApp = async (): Promise<void> => {
  const windowLogger = await createWindow();

  ipcMain.handle('session', async (_, { accessToken }) => {
    try {
      const response = await fetch(voodooServerTokenApiUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.status !== 200 || !response.ok) return { ok: false, error: response.statusText };

      if (heartbeatHandle === null) {
        startListening(windowLogger);

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
