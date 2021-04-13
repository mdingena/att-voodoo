import path from 'path';
import { execFile } from 'child_process';
import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';

let mainWindow: BrowserWindow | null = null;

const createWindow = async (): Promise<void> => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  console.log({ isDev });
  await mainWindow.loadURL(isDev ? 'http://localhost:9000' : `file://${__dirname}/../../build/ui/index.html`);
  mainWindow.on('closed', () => (mainWindow = null));

  const exePath = isDev
    ? path.join(__dirname, '../../build/speech/VoodooListener.exe')
    : path.join(process.resourcesPath, 'speech/VoodooListener.exe');

  const speech = execFile(exePath);
  speech.on('exit', exitCode => console.log({ exitCode }));
  speech.stdout?.on('data', data => console.log({ data }));
  speech.stderr?.on('data', error => console.error({ error }));
};

app.on('ready', createWindow);
