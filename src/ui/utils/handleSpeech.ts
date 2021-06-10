import { ipcMain, BrowserWindow } from 'electron';
import { voodooDelete } from './voodooDelete';
import { voodooGet } from './voodooGet';
import { voodooPost } from './voodooPost';
import { getMaterialComponents } from './getMaterialComponents';
import config from '../config';

type Incantation = [string, number];

type PreparedSpell = {
  name: string;
  verbalTrigger: string;
  incantations: Incantation[];
};

const MODES = {
  AWAKE: 'AWAKE',
  INCANTING: 'INCANTING',
  SUPPRESSED: 'SUPPRESSED'
};

const PHRASES = {
  AWAKEN: 'awaken voodoo',
  INCANTATION: {
    START: 'attune voodoo',
    CONFIRM: 'seal',
    ABORT: 'nullify'
  },
  SUPPRESS: 'suppress voodoo',
  TRIGGER: 'evoke'
};

let hasServerConnection = false;

ipcMain.handle('server-connected', () => {
  hasServerConnection = true;
});

ipcMain.handle('server-disconnected', () => {
  hasServerConnection = false;
});

let mode = MODES.SUPPRESSED;
let incantations: string[] = [];
let preparedSpells: PreparedSpell[] = [];

export const handleSpeech = async (
  ui: BrowserWindow | null,
  speech: string,
  accessToken: string,
  logger: (...args: any) => void
) => {
  if (!hasServerConnection) {
    mode = MODES.SUPPRESSED;
    ui?.webContents.send('voodoo-suppressed');
    return;
  }

  logger('Recognised speech:', speech);
  const isAwakenPhrase = speech === PHRASES.AWAKEN;
  const isTriggerPhrase = speech.split(' ')[0] === PHRASES.TRIGGER;

  switch (mode) {
    case MODES.SUPPRESSED:
      if (isAwakenPhrase) {
        mode = MODES.AWAKE;
        ui?.webContents.send('voodoo-awake');
        logger({ mode });
      }
      break;

    case MODES.AWAKE:
      switch (speech) {
        case PHRASES.SUPPRESS:
          mode = MODES.SUPPRESSED;
          ui?.webContents.send('voodoo-suppressed');
          logger({ mode });
          break;

        case PHRASES.INCANTATION.START:
          mode = MODES.INCANTING;
          ui?.webContents.send('voodoo-incanting');
          logger({ mode });
          break;

        default:
          if (isTriggerPhrase) {
            const verbalTrigger = speech.replace(`${PHRASES.TRIGGER} `, '');
            const response = await voodooPost(accessToken, config.API_ENDPOINTS.TRIGGER, [verbalTrigger]);

            if (response.ok) {
              preparedSpells = response.result;
              ui?.webContents.send('voodoo-prepared-spell-triggered', preparedSpells);
              logger({ preparedSpells });
            } else {
              logger(response.error);
            }
          }
          break;
      }
      break;

    case MODES.INCANTING:
      switch (speech) {
        case PHRASES.SUPPRESS:
          mode = MODES.SUPPRESSED;
          ui?.webContents.send('voodoo-suppressed');
          logger({ mode });
          break;

        case PHRASES.INCANTATION.ABORT:
          mode = MODES.AWAKE;
          ui?.webContents.send('voodoo-awake');
          logger({ mode });

          const abortResponse = await voodooDelete(accessToken, config.API_ENDPOINTS.INCANTATION);

          if (abortResponse.ok) {
            incantations = abortResponse.result;
            ui?.webContents.send('voodoo-incantation-aborted', incantations);
            logger({ incantations });
          } else {
            logger(abortResponse.error);
          }
          break;

        case PHRASES.INCANTATION.CONFIRM:
          mode = MODES.AWAKE;
          ui?.webContents.send('voodoo-awake');
          logger({ mode });

          const confirmResponse = await voodooGet(accessToken, config.API_ENDPOINTS.SEAL);

          if (confirmResponse.ok) {
            incantations = confirmResponse.result.incantations;
            preparedSpells = confirmResponse.result.preparedSpells;
            ui?.webContents.send('voodoo-incantation-confirmed', incantations, preparedSpells);
            logger({ incantations, preparedSpells });
          } else {
            logger(confirmResponse.error);
          }
          break;

        default:
          if (!isAwakenPhrase && !isTriggerPhrase) {
            const response = await voodooPost(accessToken, config.API_ENDPOINTS.INCANTATION, [
              speech,
              getMaterialComponents(speech)
            ]);

            if (response.ok) {
              incantations = response.result.incantations;
              preparedSpells = response.result.preparedSpells;

              if (response.result.incantations.length === 4) {
                mode = MODES.AWAKE;
                ui?.webContents.send('voodoo-incantation-confirmed', incantations, preparedSpells);
                ui?.webContents.send('voodoo-awake');
                logger({ mode });
              } else {
                ui?.webContents.send('voodoo-incantation', incantations, preparedSpells);
              }

              logger({ incantations, preparedSpells });
            } else {
              logger(response.error);
            }
          }
      }
  }
};
