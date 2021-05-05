import path from 'path';
import isDev from 'electron-is-dev';

const development = {
  VOODOO_EXE_PATH: path.resolve(__dirname, '../../build/speech/VoodooListener.exe'),
  VOODOO_GRAMMAR_PATH: path.resolve(__dirname, '../../build/speech/grammar.xml'),
  APP_URL: 'http://localhost:9000/#',
  API_ENDPOINTS: {
    SESSION: 'http://localhost:3000/session',
    HEARTBEAT: 'http://localhost:3000/heartbeat'
  }
};

const production = {
  VOODOO_EXE_PATH: path.resolve(process.resourcesPath, 'speech/VoodooListener.exe'),
  VOODOO_GRAMMAR_PATH: path.resolve(process.resourcesPath, 'speech/grammar.xml'),
  APP_URL: `file://${path.resolve(__dirname, '../../build/ui/index.html')}#`,
  API_ENDPOINTS: {
    SESSION: 'https://att-voodoo-server.herokuapp.com/session',
    HEARTBEAT: 'https://att-voodoo-server.herokuapp.com/heartbeat'
  }
};

const config = {
  development,
  production
};

const environment = isDev ? 'development' : 'production';

export default {
  ...config[environment]
};
