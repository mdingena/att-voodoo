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
  incantationsAtom,
  Incantation,
  preparedSpellsAtom,
  PreparedSpell
} from '@/atoms';
import { ServersUpdate } from '@/components/ServersScreen';
import { Dock } from '@/components/Dock';
import { SpellTrigger } from '@/components/SpellTrigger';
import styles from './Dashboard.module.css';
import chimeAudioFile from './chime.wav';
import pingAudioFile from './ping.wav';
import dockAudioFile from './dock.wav';
import castAudioFile from './cast.wav';
import droneAudioFile from './drone.wav';

const VOLUME_EXPONENT = 3; /* Linear volume adjustments are evil! */

const chimeAudio = new Audio(chimeAudioFile);
chimeAudio.volume = Math.pow(0.5, VOLUME_EXPONENT);

const pingAudio = new Audio(pingAudioFile);
pingAudio.volume = Math.pow(0.5, VOLUME_EXPONENT);

const dockAudio = new Audio(dockAudioFile);
dockAudio.volume = Math.pow(0.5, VOLUME_EXPONENT);
dockAudio.playbackRate = 1.25;

const castAudio = new Audio(castAudioFile);
castAudio.volume = Math.pow(0.4, VOLUME_EXPONENT);
castAudio.playbackRate = 2.5;

const droneAudio = new Audio(droneAudioFile);
droneAudio.volume = Math.pow(0.5, VOLUME_EXPONENT);
droneAudio.playbackRate = 1.5;

enum Mode {
  Suppressed = SpeechMode.Suppressed,
  Ready = SpeechMode.Awake,
  Attuning = SpeechMode.Incanting
}

export const Dashboard = () => {
  const [speechMode, setSpeechMode] = useAtom(speechModeAtom);
  const [activeServer, setActiveServer] = useAtom(activeServerAtom);
  const [appStage, setAppStage] = useAtom(appStageAtom);
  const [incantations, setIncantations] = useAtom(incantationsAtom);
  const [preparedSpells, setPreparedSpells] = useAtom(preparedSpellsAtom);

  // @todo test this
  const handleUpdateServers = (_: Event, { playerJoined }: ServersUpdate) => {
    setActiveServer(playerJoined);
  };

  const handleVoodooSuppressed = () => {
    setSpeechMode(SpeechMode.Suppressed);
    pingAudio.currentTime = 0;
    pingAudio.play();
  };

  const handleVoodooAwake = useAtomCallback(
    useCallback(get => {
      const speechMode = get(speechModeAtom);
      if (speechMode === SpeechMode.Suppressed) {
        pingAudio.currentTime = 0;
        pingAudio.play();
      }
      setSpeechMode(SpeechMode.Awake);
    }, [])
  );

  const handleVoodooIncanting = () => {
    setSpeechMode(SpeechMode.Incanting);
    chimeAudio.currentTime = 0;
    chimeAudio.play();
  };

  const handleVoodooPreparedSpellTriggered = (_: Event, preparedSpells: PreparedSpell[]) => {
    setPreparedSpells(preparedSpells);
    castAudio.currentTime = 0;
    castAudio.play();
  };

  const handleVoodooIncantationAborted = (_: Event, incantations: Incantation[]) => {
    setIncantations(incantations);
    droneAudio.currentTime = 0;
    droneAudio.play();
  };

  const handleVoodooIncantationConfirmed = (_: Event, incantations: Incantation[], preparedSpells: PreparedSpell[]) => {
    setIncantations(incantations);
    setPreparedSpells(preparedSpells);
    castAudio.currentTime = 0;
    castAudio.play();
  };

  const handleVoodooIncantation = (_: Event, incantations: Incantation[], preparedSpells: PreparedSpell[]) => {
    setIncantations(incantations);
    setPreparedSpells(preparedSpells);
    if (incantations.length === 0) {
      castAudio.currentTime = 0;
      castAudio.play();
    } else {
      dockAudio.currentTime = 0;
      dockAudio.play();
    }
  };

  useEffect(() => {
    ipcRenderer.on('update-servers', handleUpdateServers);
    ipcRenderer.on('voodoo-suppressed', handleVoodooSuppressed);
    ipcRenderer.on('voodoo-awake', handleVoodooAwake);
    ipcRenderer.on('voodoo-incanting', handleVoodooIncanting);
    ipcRenderer.on('voodoo-prepared-spell-triggered', handleVoodooPreparedSpellTriggered);
    ipcRenderer.on('voodoo-incantation-aborted', handleVoodooIncantationAborted);
    ipcRenderer.on('voodoo-incantation-confirmed', handleVoodooIncantationConfirmed);
    ipcRenderer.on('voodoo-incantation', handleVoodooIncantation);

    return () => {
      ipcRenderer.removeListener('update-server', handleUpdateServers);
      ipcRenderer.removeListener('voodoo-suppressed', handleVoodooSuppressed);
      ipcRenderer.removeListener('voodoo-awake', handleVoodooAwake);
      ipcRenderer.removeListener('voodoo-incanting', handleVoodooIncanting);
      ipcRenderer.removeListener('voodoo-prepared-spell-triggered', handleVoodooPreparedSpellTriggered);
      ipcRenderer.removeListener('voodoo-incantation-aborted', handleVoodooIncantationAborted);
      ipcRenderer.removeListener('voodoo-incantation', handleVoodooIncantation);
    };
  }, []);

  useEffect(() => {
    if (activeServer === null) setAppStage(AppStage.WaitingForServer);
  }, [activeServer]);

  const modeStyle = SpeechMode[speechMode].toLowerCase();

  return (
    <div className={styles.root}>
      <div className={styles[modeStyle]}>{Mode[speechMode]}</div>
      <div className={styles.incantations}>
        <Dock slot={0} />
        <Dock slot={1} />
        <Dock slot={2} />
        <Dock slot={3} />
      </div>
      <div className={styles.spellsHeader}>Prepared Spells</div>
      <div className={styles.spells}>
        {preparedSpells.map((spell, index) => (
          <SpellTrigger key={`spell-${index}`} spell={spell} />
        ))}
      </div>
    </div>
  );
};
