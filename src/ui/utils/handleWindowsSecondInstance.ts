import { findDeepLinkUrl } from './findDeepLinkUrl';
import { loadDeepLinkUrl } from './loadDeepLinkUrl';

export const handleWindowsSecondInstance = (ui: Electron.BrowserWindow) => async (
  event: Electron.Event,
  cliArgs: string[]
) => {
  const url = findDeepLinkUrl(cliArgs);
  if (url) {
    const loadUrl = loadDeepLinkUrl(ui);
    loadUrl(url);
  }
};
