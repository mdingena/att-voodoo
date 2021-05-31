import { useCallback, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useAtom } from 'jotai';
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

enum Mode {
  Suppressed = SpeechMode.Suppressed,
  Ready = SpeechMode.Awake,
  Attuning = SpeechMode.Incanting
}

export const Dashboard = () => {
  const [speechMode, setSpeechMode] = useAtom(speechModeAtom);
  const [activeServer] = useAtom(activeServerAtom);
  const [appStage, setAppStage] = useAtom(appStageAtom);
  const [incantations, setIncantations] = useAtom(incantationsAtom);
  const [preparedSpells, setPreparedSpells] = useAtom(preparedSpellsAtom);

  const handleUpdateServers = useCallback(
    (_: Event, { playerJoined }: ServersUpdate) => {
      if (playerJoined !== activeServer) setAppStage(AppStage.WaitingForServer);
    },
    [activeServer]
  );

  const handleVoodooSuppressed = () => {
    setSpeechMode(SpeechMode.Suppressed);
  };

  const handleVoodooAwake = () => {
    setSpeechMode(SpeechMode.Awake);
  };

  const handleVoodooIncanting = () => {
    setSpeechMode(SpeechMode.Incanting);
  };

  const handleVoodooPreparedSpellTriggered = (_: Event, preparedSpells: PreparedSpell[]) => {
    setPreparedSpells(preparedSpells);
  };

  const handleVoodooIncantationAborted = (_: Event, incantations: Incantation[]) => {
    setIncantations(incantations);
  };

  const handleVoodooIncantationConfirmed = (_: Event, incantations: Incantation[], preparedSpells: PreparedSpell[]) => {
    setIncantations(incantations);
    setPreparedSpells(preparedSpells);
  };

  const handleVoodooIncantation = (_: Event, incantations: Incantation[], preparedSpells: PreparedSpell[]) => {
    setIncantations(incantations);
    setPreparedSpells(preparedSpells);
  };

  useEffect(() => {
    setTimeout(() => {
      ipcRenderer.invoke('session', {
        accountId: 12345,
        accessToken: '12345'
      });
    }, 6000);
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
