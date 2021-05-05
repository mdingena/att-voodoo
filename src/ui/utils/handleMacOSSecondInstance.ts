import { BrowserWindow, Event } from 'electron';
import { loadDeepLinkUrl } from './loadDeepLinkUrl';

export const handleMacOSSecondInstance = (ui: BrowserWindow) => (event: Event, url: string) => {
  if (url.startsWith('att-voodoo://')) {
    const loadUrl = loadDeepLinkUrl(ui);
    loadUrl(url);
  }
};
