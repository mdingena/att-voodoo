import path from 'path';
import { ChildProcess, execFile } from 'child_process';
import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { config as configEnv } from 'dotenv';
import { createDevToolsLogger } from './utils/createDevToolsLogger';

if (isDev) configEnv();

app.setAsDefaultProtocolClient('att-voodoo');

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
