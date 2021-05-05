import path from 'path';
import { App } from 'electron';

export const setUriScheme = (app: App) => {
  app.removeAsDefaultProtocolClient('att-voodoo');

  if (process.env.NODE_ENV === 'development' && process.platform === 'win32') {
    app.setAsDefaultProtocolClient('att-voodoo', process.execPath, [path.resolve(process.argv[1])]);
  } else {
    app.setAsDefaultProtocolClient('att-voodoo');
  }
};
