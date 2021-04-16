import path from 'path';
import { ChildProcess, execFile } from 'child_process';
import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { config as configEnv } from 'dotenv';
import { createDevToolsLogger } from './utils/createDevToolsLogger';

if (isDev) configEnv();

app.setAsDefaultProtocolClient('att-voodoo');
app.on('open-url', (e, data) => {
  e.preventDefault();

  console.log(data);
});

const hasInstanceLock = app.requestSingleInstanceLock();
if (!hasInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', async (event, commandLine, workingDirectory) => {
    console.log(commandLine);
  });
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

  //if (isDev) {
  win.webContents.openDevTools();
  logger({ 'process args': process.argv });
  //}

  await win.loadURL(isDev ? 'http://localhost:9000' : `file://${__dirname}/../../build/ui/index.html`);

  win.on('closed', terminate);
  win.once('ready-to-show', () => win?.show());
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
