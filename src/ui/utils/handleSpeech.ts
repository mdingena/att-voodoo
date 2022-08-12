import { ipcMain, BrowserWindow } from 'electron';
import { Experience } from '@/atoms';
import { voodooDelete } from './voodooDelete';
import { voodooGet } from './voodooGet';
import { voodooPost } from './voodooPost';
import { getMaterialComponents } from './getMaterialComponents';
import config from '../config';

enum StudyFeedback {
  Match = 'MATCH',
  Partial = 'PARTIAL',
  Mismatch = 'MISMATCH'
}

type Feedback = StudyFeedback | undefined;

type Incantation = [string, string, Feedback];

type PreparedSpell = {
  name: string;
  verbalTrigger: string;
  incantations: Incantation[];
};

const MODES = {
  AWAKE: 'AWAKE',
  INCANTING: 'INCANTING',
  ENERGIZING: 'ENERGIZING',
  SUPPRESSED: 'SUPPRESSED'
};

const PHRASES = {
  AWAKEN: 'awaken voodoo',
  INCANTATION: {
    START: 'attune voodoo',
    CONFIRM: 'seal',
    ABORT: 'nullify'
  },
  ENERGIZE: {
    START: 'sanguinem magicae',
    ABORT: 'nullify'
  },
  SUPPRESS: 'suppress voodoo',
  TRIGGER: 'evoke',
  BLOOD_TRIGGER: 'excio'
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
let studiedSpellKey: string | null = null;
let energizingResponse: any;

ipcMain.handle('study-spell', (_, spellKey: string) => {
  studiedSpellKey = spellKey;
});

export const handleSpeech = async (
  ui: BrowserWindow | null,
  speech: string,
  accessToken: string,
  logger: (...args: unknown[]) => void
): Promise<void> => {
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
  const isBloodTriggerPhrase = speech.split(' ')[0] === PHRASES.BLOOD_TRIGGER;

  let response;

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

        case PHRASES.ENERGIZE.START:
          energizingResponse = await voodooGet(accessToken, config.API_ENDPOINTS.BLOOD_INCANTATION);

          if (energizingResponse.ok && energizingResponse.result) {
            mode = MODES.ENERGIZING;
            ui?.webContents.send('voodoo-energizing');
            logger({ mode });
          } else {
            logger(energizingResponse.error);
          }
          break;

        default:
          if (isTriggerPhrase || isBloodTriggerPhrase) {
            const verbalTrigger = speech.replace(`${PHRASES.TRIGGER} `, '').replace(`${PHRASES.BLOOD_TRIGGER} `, '');
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

          response = await voodooDelete(accessToken, config.API_ENDPOINTS.INCANTATION);

          if (response.ok) {
            incantations = response.result;
            ui?.webContents.send('voodoo-incantation-aborted', incantations);
            logger({ incantations });
          } else {
            logger(response.error);
          }
          break;

        case PHRASES.INCANTATION.CONFIRM:
          mode = MODES.AWAKE;
          ui?.webContents.send('voodoo-awake');
          logger({ mode });

          response = await voodooGet(accessToken, config.API_ENDPOINTS.SEAL);

          if (response.ok) {
            experience = response.result.experience;
            incantations = response.result.incantations;
            preparedSpells = response.result.preparedSpells;
            ui?.webContents.send('voodoo-incantation-confirmed', experience, incantations, preparedSpells);
            logger({ experience, incantations, preparedSpells });
          } else {
            logger(response.error);
          }
          break;

        default:
          if (!isAwakenPhrase && !isTriggerPhrase && !isBloodTriggerPhrase) {
            const response = await voodooPost(accessToken, config.API_ENDPOINTS.INCANTATION, [
              speech,
              getMaterialComponents(speech),
              studiedSpellKey
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
      break;

    case MODES.ENERGIZING:
      switch (speech) {
        case PHRASES.SUPPRESS:
          mode = MODES.SUPPRESSED;
          ui?.webContents.send('voodoo-suppressed');
          logger({ mode });
          break;

        case PHRASES.ENERGIZE.ABORT:
          mode = MODES.AWAKE;
          ui?.webContents.send('voodoo-awake');
          logger({ mode });

          response = await voodooDelete(accessToken, config.API_ENDPOINTS.BLOOD_INCANTATION);

          if (response.ok) {
            incantations = response.result;
            ui?.webContents.send('voodoo-incantation-aborted', incantations);
            logger({ incantations });
          } else {
            logger(response.error);
          }
          break;

        default:
          if (!isAwakenPhrase && !isTriggerPhrase && !isBloodTriggerPhrase) {
            const response = await voodooPost(accessToken, config.API_ENDPOINTS.BLOOD_INCANTATION, [speech]);

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
