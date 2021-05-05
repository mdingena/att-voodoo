import { BrowserWindow, Event } from 'electron';
import { findDeepLinkUrl } from './findDeepLinkUrl';
import { loadDeepLinkUrl } from './loadDeepLinkUrl';

export const handleWindowsSecondInstance = (ui: BrowserWindow) => async (event: Event, cliArgs: string[]) => {
  const url = findDeepLinkUrl(cliArgs);
  if (url) {
    const loadUrl = loadDeepLinkUrl(ui);
    loadUrl(url);
  }
};
