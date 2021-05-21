import { voodooDelete } from './voodooDelete';
import { voodooGet } from './voodooGet';
import { voodooPost } from './voodooPost';
import { getMaterialComponents } from './getMaterialComponents';
import config from '../config';

type Incantation = [string, number];

type PreparedSpells = [
  {
    verbalTrigger: string;
    incantations: Incantation[];
  }
];

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

let mode = MODES.SUPPRESSED;
let incantations: string[] = [];
let preparedSpells: PreparedSpells[] = [];

export const handleSpeech = async (speech: string, accessToken: string, logger: (...args: any) => void) => {
  logger(`Voodoo recognised:`, speech);
  const isAwakenPhrase = speech === PHRASES.AWAKEN;
  const isTriggerPhrase = speech.split(' ')[0] === PHRASES.TRIGGER;

  switch (mode) {
    case MODES.SUPPRESSED:
      if (isAwakenPhrase) {
        mode = MODES.AWAKE;
        logger({ mode });
      }
      break;

    case MODES.AWAKE:
      switch (speech) {
        case PHRASES.SUPPRESS:
          mode = MODES.SUPPRESSED;
          logger({ mode });
          break;

        case PHRASES.INCANTATION.START:
          mode = MODES.INCANTING;
          logger({ mode });
          break;

        default:
          if (isTriggerPhrase) {
            const verbalTrigger = speech.replace(`${PHRASES.TRIGGER} `, '');
            const response = await voodooPost(accessToken, config.API_ENDPOINTS.TRIGGER, [verbalTrigger]);

            if (response.ok) {
              preparedSpells = response.result;
              logger({ preparedSpells });
              // @todo show preparedSpells in UI
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
          logger({ mode });
          break;

        case PHRASES.INCANTATION.ABORT:
          mode = MODES.AWAKE;
          logger({ mode });
          const abortResponse = await voodooDelete(accessToken, config.API_ENDPOINTS.INCANTATION);

          if (abortResponse.ok) {
            incantations = abortResponse.result;
            logger({ incantations });
            // @todo show incantations in UI
          } else {
            logger(abortResponse.error);
          }
          break;

        case PHRASES.INCANTATION.CONFIRM:
          mode = MODES.AWAKE;
          logger({ mode });
          const confirmResponse = await voodooGet(accessToken, config.API_ENDPOINTS.SEAL);

          if (confirmResponse.ok) {
            incantations = confirmResponse.result.incantations;
            preparedSpells = confirmResponse.result.preparedSpells;
            logger({ incantations, preparedSpells });
            // @todo show incantations & preparedSpells in UI
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
              if (response.result.incantations.length === 4) {
                mode = MODES.AWAKE;
                logger({ mode });
              }
              incantations = response.result.incantations;
              preparedSpells = response.result.preparedSpells;
              logger({ incantations, preparedSpells });
              // @todo show incantations & preparedSpells in UI
            } else {
              logger(response.error);
            }
          }
      }
  }
};
