import path from 'path';
import isDev from 'electron-is-dev';

const development = {
  VOODOO_EXE_PATH: path.resolve(__dirname, '../../build/speech/VoodooListener.exe'),
  VOODOO_GRAMMAR_PATH: path.resolve(__dirname, '../../build/speech/grammar.xml'),
  APP_URL: 'http://localhost:9001/#',
  API_ENDPOINTS: {
    SESSION: 'http://localhost:3000/session',
    PLAYER: 'http://localhost:3000/player',
    SETTINGS: 'http://localhost:3000/settings',
    SPELLBOOK: 'http://localhost:3000/spellbook',
    UPGRADE: 'http://localhost:3000/upgrade',
    HEARTBEAT: 'http://localhost:3000/heartbeat',
    INCANTATION: 'http://localhost:3000/incantation',
    BLOOD_INCANTATION: 'http://localhost:3000/blood-incantation',
    SEAL: 'http://localhost:3000/seal',
    TRIGGER: 'http://localhost:3000/trigger'
  },
  INTERVALS: {
    current: 15000,
    SERVER_WAIT: 15000,
    HEARTBEAT: 60000
  }
};

const production = {
  VOODOO_EXE_PATH: path.resolve(process.resourcesPath, 'speech/VoodooListener.exe'),
  VOODOO_GRAMMAR_PATH: path.resolve(process.resourcesPath, 'speech/grammar.xml'),
  APP_URL: `file://${path.resolve(__dirname, '../../build/ui/index.html')}#`,
  API_ENDPOINTS: {
    SESSION: 'https://att-voodoo-server.herokuapp.com/session',
    PLAYER: 'https://att-voodoo-server.herokuapp.com/player',
    SETTINGS: 'https://att-voodoo-server.herokuapp.com/settings',
    SPELLBOOK: 'https://att-voodoo-server.herokuapp.com/spellbook',
    UPGRADE: 'https://att-voodoo-server.herokuapp.com/upgrade',
    HEARTBEAT: 'https://att-voodoo-server.herokuapp.com/heartbeat',
    INCANTATION: 'https://att-voodoo-server.herokuapp.com/incantation',
    BLOOD_INCANTATION: 'https://att-voodoo-server.herokuapp.com/blood-incantation',
    SEAL: 'https://att-voodoo-server.herokuapp.com/seal',
    TRIGGER: 'https://att-voodoo-server.herokuapp.com/trigger'
  },
  INTERVALS: {
    current: 15000,
    SERVER_WAIT: 15000,
    HEARTBEAT: 60000
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
