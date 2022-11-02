import { useCallback, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import {
  speechModeAtom,
  SpeechMode,
  activeServerAtom,
  appStageAtom,
  AppStage,
  accessTokenAtom,
  incantationsAtom,
  Incantation,
  preparedSpellsAtom,
  PreparedSpell,
  experienceAtom,
  Panel,
  panelAtom,
  Experience
} from '@/atoms';
import { ServersUpdate } from '@/components/ServersScreen';
import { Dock } from '@/components/Dock';
import { SpellTrigger } from '@/components/SpellTrigger';
import { SettingsPanel } from '../SettingsPanel';
import { SpellbookPanel } from '../SpellbookPanel';
import styles from './Dashboard.module.css';
import chimeAudioFile from './chime.wav';
import pingAudioFile from './ping.wav';
import dockAudioFile from './dock.wav';
import castAudioFile from './cast.wav';
import droneAudioFile from './drone.wav';

const PREPARED_SPELLS_CONFIG = {
  min: 10,
  max: 25,
  constant: 0.0000343
};

const calcPreparedSpells = (xpTotal: number): number => {
  const { min, max, constant } = PREPARED_SPELLS_CONFIG;
  const preparedSpells = max - (max - min) * Math.exp(-constant * xpTotal);

  return Math.round(preparedSpells);
};

const VOLUME_EXPONENT = 3; /* Linear volume adjustments are evil! */

const chimeAudio = new Audio(chimeAudioFile);
chimeAudio.volume = Math.pow(0.6, VOLUME_EXPONENT);

const pingAudio = new Audio(pingAudioFile);
pingAudio.volume = Math.pow(0.6, VOLUME_EXPONENT);

const dockAudio = new Audio(dockAudioFile);
dockAudio.volume = Math.pow(0.6, VOLUME_EXPONENT);
dockAudio.playbackRate = 1.25;

const castAudio = new Audio(castAudioFile);
castAudio.volume = Math.pow(0.5, VOLUME_EXPONENT);
castAudio.playbackRate = 2.5;

const droneAudio = new Audio(droneAudioFile);
droneAudio.volume = Math.pow(0.6, VOLUME_EXPONENT);
droneAudio.playbackRate = 1.5;

enum Mode {
  Locked = SpeechMode.Locked,
  Suppressed = SpeechMode.Suppressed,
  Ready = SpeechMode.Awake,
  Attuning = SpeechMode.Incanting
}

export const Dashboard = (): JSX.Element => {
  const [speechMode, setSpeechMode] = useAtom(speechModeAtom);
  const [activeServer, setActiveServer] = useAtom(activeServerAtom);
  const [, setAppStage] = useAtom(appStageAtom);
  const [accessToken] = useAtom(accessTokenAtom);
  const [, setIncantations] = useAtom(incantationsAtom);
  const [preparedSpells, setPreparedSpells] = useAtom(preparedSpellsAtom);
  const [experience, setExperience] = useAtom(experienceAtom);
  const [panel, setPanel] = useAtom(panelAtom);

  const openSettingsPanel = () => {
    setPanel(Panel.Settings);
  };

  const openSpellbookPanel = () => {
    setPanel(Panel.Spellbook);
  };

  const handleUpdateServers = useCallback(
    (_: Event, { playerJoined }: ServersUpdate) => {
      setActiveServer(playerJoined);
    },
    [setActiveServer]
  );

  const handleVoodooSuppressed = useCallback(() => {
    setSpeechMode(SpeechMode.Suppressed);
    pingAudio.currentTime = 0;
    pingAudio.play();
  }, [setSpeechMode]);

  const handleVoodooAwake = useAtomCallback(
    useCallback(
      get => {
        const speechMode = get(speechModeAtom);
        if (speechMode === SpeechMode.Suppressed) {
          pingAudio.currentTime = 0;
          pingAudio.play();
        }
        setSpeechMode(SpeechMode.Awake);
      },
      [setSpeechMode]
    )
  );

  const handleVoodooIncanting = useCallback(() => {
    setSpeechMode(SpeechMode.Incanting);
    chimeAudio.currentTime = 0;
    chimeAudio.play();
  }, [setSpeechMode]);

  const handleVoodooPreparedSpellTriggered = useCallback(
    (_: Event, newExperience: Experience, preparedSpells: PreparedSpell[]) => {
      setExperience(newExperience);
      setPreparedSpells(preparedSpells);
      castAudio.currentTime = 0;
      castAudio.play();
    },
    [setExperience, setPreparedSpells]
  );

  const handleVoodooIncantationAborted = useCallback(
    (_: Event, incantations: Incantation[]) => {
      setIncantations(incantations);
      droneAudio.currentTime = 0;
      droneAudio.play();
    },
    [setIncantations]
  );

  const handleVoodooIncantationConfirmed = useCallback(
    (_: Event, newExperience: Experience, incantations: Incantation[], preparedSpells: PreparedSpell[]) => {
      setExperience(newExperience);
      // @todo The returned incantations are not the up-to-date incantations on the server,
      // @todo but the incantations used to trigger the spell. This makes it easier to have
      // @todo a log of incantations later.
      // setIncantations(incantations);
      setIncantations([]);
      if (preparedSpells) setPreparedSpells(preparedSpells);
      castAudio.currentTime = 0;
      castAudio.play();
    },
    [setExperience, setIncantations, setPreparedSpells]
  );

  const handleVoodooIncantation = useCallback(
    (_: Event, incantations: Incantation[], preparedSpells: PreparedSpell[]) => {
      setIncantations(incantations);
      if (preparedSpells) setPreparedSpells(preparedSpells);
      dockAudio.currentTime = 0;
      dockAudio.play();
    },
    [setIncantations, setPreparedSpells]
  );

  useEffect(() => {
    ipcRenderer.on('update-servers', handleUpdateServers);
    ipcRenderer.on('voodoo-suppressed', handleVoodooSuppressed);
    ipcRenderer.on('voodoo-awake', handleVoodooAwake);
    ipcRenderer.on('voodoo-incanting', handleVoodooIncanting);
    ipcRenderer.on('voodoo-prepared-spell-triggered', handleVoodooPreparedSpellTriggered);
    ipcRenderer.on('voodoo-incantation-aborted', handleVoodooIncantationAborted);
    ipcRenderer.on('voodoo-incantation-confirmed', handleVoodooIncantationConfirmed);
    ipcRenderer.on('voodoo-incantation', handleVoodooIncantation);

    ipcRenderer
      .invoke('update-player', { accessToken })
      .then(response => {
        if (response.ok) {
          setPreparedSpells(response.result.preparedSpells);
          setExperience(response.result.experience);
        } else {
          console.error(response.error);
        }
      })
      .catch(error => {
        console.error(error.message);
      });

    return () => {
      ipcRenderer.removeListener('update-server', handleUpdateServers);
      ipcRenderer.removeListener('voodoo-suppressed', handleVoodooSuppressed);
      ipcRenderer.removeListener('voodoo-awake', handleVoodooAwake);
      ipcRenderer.removeListener('voodoo-incanting', handleVoodooIncanting);
      ipcRenderer.removeListener('voodoo-prepared-spell-triggered', handleVoodooPreparedSpellTriggered);
      ipcRenderer.removeListener('voodoo-incantation-aborted', handleVoodooIncantationAborted);
      ipcRenderer.removeListener('voodoo-incantation', handleVoodooIncantation);
    };
  }, [
    accessToken,
    handleUpdateServers,
    handleVoodooSuppressed,
    handleVoodooAwake,
    handleVoodooIncanting,
    handleVoodooPreparedSpellTriggered,
    handleVoodooIncantationAborted,
    handleVoodooIncantationConfirmed,
    handleVoodooIncantation,
    setPreparedSpells,
    setExperience
  ]);

  useEffect(() => {
    if (activeServer === null) {
      setPreparedSpells([]);
      setAppStage(AppStage.WaitingForServer);
    }
  }, [activeServer, setAppStage, setPreparedSpells]);

  const { conjurationXpTotal, evocationXpTotal, transmutationXpTotal } = experience;
  const xpTotal = conjurationXpTotal + evocationXpTotal + transmutationXpTotal;

  const modeStyle = SpeechMode[speechMode].toLowerCase();

  const isPanelOpen = panel !== Panel.None;

  return (
    <>
      <div className={isPanelOpen ? styles.blur : styles.root}>
        <div className={styles[modeStyle]}>{Mode[speechMode]}</div>
        <div className={styles.incantations}>
          <Dock slot={0} />
          <Dock slot={1} />
          <Dock slot={2} />
          <Dock slot={3} />
        </div>
        <div className={styles.spellsHeader}>
          Prepared Spells{' '}
          <span className={styles.spellSlots}>
            {preparedSpells.length}/{calcPreparedSpells(xpTotal)}
          </span>
        </div>
        <div className={styles.spells}>
          {preparedSpells.map((spell, index) => (
            <SpellTrigger key={`spell-${index}`} spell={spell} />
          ))}
        </div>
        <div className={styles.actionsHeader}>
          <button className={styles.action} onClick={openSettingsPanel}>
            Settings
          </button>
          <button className={styles.action} onClick={openSpellbookPanel}>
            Spellbook
          </button>
        </div>
      </div>
      <SettingsPanel />
      <SpellbookPanel />
    </>
  );
};
