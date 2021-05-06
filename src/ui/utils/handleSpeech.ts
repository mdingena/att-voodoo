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
    ABORT: 'fizzle'
  },
  SUPPRESS: 'suppress voodoo',
  TRIGGER: 'cast'
};

let mode = MODES.SUPPRESSED;
let incantations: string[] = [];
let preparedSpells: PreparedSpells[] = [];

export const handleSpeech = async (speech: string, accessToken: string, logger: (...args: any) => void) => {
  const isAwakenPhrase = speech === PHRASES.AWAKEN;
  const isTriggerPhrase = speech.split(' ')[0] === PHRASES.TRIGGER;

  switch (mode) {
    case MODES.SUPPRESSED:
      if (isAwakenPhrase) mode = MODES.AWAKE;
      break;

    case MODES.AWAKE:
      switch (speech) {
        case PHRASES.SUPPRESS:
          mode = MODES.SUPPRESSED;
          break;

        case PHRASES.INCANTATION.START:
          mode = MODES.INCANTING;
          break;

        default:
          if (isTriggerPhrase) {
            const response = await voodooPost(accessToken, config.API_ENDPOINTS.TRIGGER, [speech]);

            if (response.ok) {
              preparedSpells = response.result;
              // @todo show preparedSpells in UI
            } else {
              logger('Problem triggering prepared spell', response.error);
            }
          }
          break;
      }
      break;

    case MODES.INCANTING:
      switch (speech) {
        case PHRASES.SUPPRESS:
          mode = MODES.SUPPRESSED;
          break;

        case PHRASES.INCANTATION.ABORT:
          const abortResponse = await voodooDelete(accessToken, config.API_ENDPOINTS.INCANTATION);

          if (abortResponse.ok) {
            incantations = abortResponse.result;
            // @todo show incantations in UI
          } else {
            logger('Problem clearing incantations', abortResponse.error);
          }
          break;

        case PHRASES.INCANTATION.CONFIRM:
          const confirmResponse = await voodooGet(accessToken, config.API_ENDPOINTS.SEAL);

          if (confirmResponse.ok) {
            incantations = confirmResponse.result.incantations;
            preparedSpells = confirmResponse.result.preparedSpells;
            // @todo show incantations & preparedSpells in UI
          } else {
            logger('Problem clearing incantations', abortResponse.error);
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
              // @todo show incantations & preparedSpells in UI
            } else {
              logger('Problem sending incantation to Voodoo Server', response.error);
            }
          }
      }
  }
};
