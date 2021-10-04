import { ipcMain, BrowserWindow } from 'electron';
import { Experience } from '@/atoms';
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

let isLocked = false;

/* Handle speech recognition lock. */
ipcMain.handle('speech-lock', (_, state) => {
  isLocked = state;
});

let mode = MODES.SUPPRESSED;
let experience: Experience;
let incantations: string[] = [];
let preparedSpells: PreparedSpell[] = [];

export const handleSpeech = async (
  ui: BrowserWindow | null,
  speech: string,
  accessToken: string,
  logger: (...args: any) => void
) => {
  if (isLocked) {
    mode = MODES.SUPPRESSED;
    return;
  }

  if (!hasServerConnection) {
    mode = MODES.SUPPRESSED;
    ui?.webContents.send('voodoo-suppressed');
    return;
  }

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
              experience = response.result.experience;
              preparedSpells = response.result.preparedSpells;
              ui?.webContents.send('voodoo-prepared-spell-triggered', experience, preparedSpells);
              logger({ experience, preparedSpells });
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
            experience = confirmResponse.result.experience;
            incantations = confirmResponse.result.incantations;
            preparedSpells = confirmResponse.result.preparedSpells;
            ui?.webContents.send('voodoo-incantation-confirmed', experience, incantations, preparedSpells);
            logger({ experience, incantations, preparedSpells });
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
              experience = response.result.experience;
              incantations = response.result.incantations;
              preparedSpells = response.result.preparedSpells;

              if (response.result.incantations.length === 4) {
                mode = MODES.AWAKE;
                ui?.webContents.send('voodoo-incantation-confirmed', experience, incantations, preparedSpells);
                ui?.webContents.send('voodoo-awake');
                logger({ mode });
              } else {
                ui?.webContents.send('voodoo-incantation', incantations, preparedSpells);
              }

              logger({ experience, incantations, preparedSpells });
            } else {
              logger(response.error);
            }
          }
      }
  }
};
