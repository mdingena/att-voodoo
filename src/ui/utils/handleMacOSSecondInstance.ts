import { loadDeepLinkUrl } from './loadDeepLinkUrl';

export const handleMacOSSecondInstance = (ui: Electron.BrowserWindow) => (event: Electron.Event, url: string) => {
  if (url.startsWith('att-voodoo://')) {
    const loadUrl = loadDeepLinkUrl(ui);
    loadUrl(url);
  }
};
