import { BrowserWindow } from 'electron';
import config from '../config';

export const loadDeepLinkUrl = (ui: BrowserWindow) => (deeplink: string): void => {
  const url = deeplink?.replace('att-voodoo://', '');

  const loadURL = `${config.APP_URL}/${url}`;

  setTimeout(() => {
    ui?.loadURL(loadURL);
  }, 1000);
};
