import { BrowserWindow } from 'electron';

export const createDevToolsLogger = (win: BrowserWindow) => (...args: any) => {
  console.log(args);
  win?.webContents?.executeJavaScript(`console.log(${JSON.stringify(args)})`);
};
