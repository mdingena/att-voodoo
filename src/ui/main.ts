import { ChildProcess } from 'child_process';
import { app, shell, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { config as configEnv } from 'dotenv';
import {
  singleInstanceLock,
  setUriScheme,
  handleNavigation,
  handleMacOSSecondInstance,
  handleWindowsSecondInstance,
  createDevToolsLogger,
  setupIPC
} from './utils';
import config from './config';

/* Configure application instance. */
if (isDev) configEnv();
singleInstanceLock(app);
setUriScheme(app);

/* Initialise application. */
const initialiseApp = async (): Promise<void> => {
  /* Create processes. */
  let speech: ChildProcess | null = null;
  let ui: BrowserWindow | null = new BrowserWindow({
    title: 'Voodoo',
    width: 360,
    height: 640,
    useContentSize: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    backgroundColor: '#062724',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    },
    show: false
  });

  /* Handle process termination. */
  const terminateProcesses = () => {
    ui = null;
    speech?.kill();
    speech = null;
  };

  /* On application quit, terminate processes. */
  ui.on('closed', terminateProcesses);

  /* Handle att-voodoo:// deep links. */
  app.on('open-url', handleMacOSSecondInstance(ui));
  app.on('second-instance', handleWindowsSecondInstance(ui));
  ui.webContents.on('will-navigate', handleNavigation(shell));

  /* Display UI window when finished loading. */
  ui.once('ready-to-show', () => ui?.show());

  /* Create a logger for both Electron and renderer processes. */
  const logger = createDevToolsLogger(ui);

  /* Load the application and setup inter-process communication. */
  ui.loadURL(config.APP_URL).then(() => setupIPC(ui, speech, logger));

  /* Open DevTools window. */
  if (isDev) {
    ui.webContents.openDevTools();
  }
};

/* Bootstrap application. */
app.on('ready', initialiseApp);
