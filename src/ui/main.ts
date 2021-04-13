import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  console.log({ isDev });
  mainWindow.loadURL(isDev ? 'http://localhost:9000' : `file://${__dirname}/../../build/ui/index.html`);
  mainWindow.on('closed', () => (mainWindow = null));
};

app.on('ready', createWindow);
