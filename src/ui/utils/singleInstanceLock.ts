import { App } from 'electron';

export const singleInstanceLock = (app: App) => {
  const hasInstanceLock = app.requestSingleInstanceLock();
  if (!hasInstanceLock) {
    app.quit();
  }
};
