import { ChildProcess } from 'child_process';
import { app, shell, powerSaveBlocker, BrowserWindow, Menu } from 'electron';
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
configEnv();
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
      nodeIntegration: true,
      backgroundThrottling: false
    },
    show: false
  });

  /**
   * Prevent throttling in an attempt to keep VoodooListener working and the UI updating
   * even when the Voodoo window isn't focused.
   */
  const psb = powerSaveBlocker.start('prevent-app-suspension');

  /* Handle process termination. */
  const terminateProcesses = () => {
    ui = null;
    speech?.kill();
    speech = null;
    powerSaveBlocker.stop(psb);
  };

  /* Prevent window refesh. */
  if (!isDev && !process.env.DEBUG) {
    if (process.platform === 'win32') ui.removeMenu(); // Windows
    if (process.platform === 'darwin') Menu.setApplicationMenu(Menu.buildFromTemplate([]));
  }

  /* On application quit, terminate processes. */
  ui.on('closed', terminateProcesses);

  /* Handle att-voodoo:// deep links. */
  app.on('open-url', handleMacOSSecondInstance(ui));
  app.on('second-instance', handleWindowsSecondInstance(ui));
  ui.webContents.on('will-navigate', handleNavigation(shell));

  /* Display UI window when finished loading. */
  ui.on('show', () => setTimeout(() => ui?.focus(), 200));
  ui.once('ready-to-show', () => ui?.show());

  /* Create a logger for both Electron and renderer processes. */
  const logger = createDevToolsLogger(ui);

  /* Load the application and setup inter-process communication. */
  ui.loadURL(config.APP_URL).then(() => setupIPC(ui, speech, logger));

  /* Open DevTools window. */
  if (isDev || process.env.DEBUG) {
    ui.webContents.openDevTools();
  }
};

/* Bootstrap application. */
app.on('ready', initialiseApp);
