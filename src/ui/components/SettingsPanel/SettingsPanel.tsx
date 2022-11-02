import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useAtom } from 'jotai';
import { Panel, panelAtom, SpeechMode, speechModeAtom } from '@/atoms';
import { Button } from '../Button';
import styles from './SettingsPanel.module.css';

export const SettingsPanel = (): JSX.Element => {
  const [panel, setPanel] = useAtom(panelAtom);
  const [speechMode, setSpeechMode] = useAtom(speechModeAtom);

  const closePanel = () => {
    setPanel(Panel.None);
  };

  const toggleLock = () => {
    setSpeechMode(mode => (mode === SpeechMode.Locked ? SpeechMode.Suppressed : SpeechMode.Locked));
  };

  const toggleDebug = () => {
    ipcRenderer.invoke('toggle-dev-tools');
  };

  useEffect(() => {
    ipcRenderer.invoke('speech-lock', speechMode === SpeechMode.Locked);
  }, [speechMode]);

  const isOpen = panel === Panel.Settings;

  return (
    <div className={isOpen ? styles.open : styles.closed}>
      <div>
        <div className={styles.header}>Settings</div>
        <div className={styles.settings}>
          <Button onClick={toggleLock}>{speechMode === SpeechMode.Locked ? 'Unlock' : 'Lock'} Voodoo</Button>
          <div className={styles.description}>
            Stops all speech recognition. Useful if you notice Voodoo keeps awakening when you don&apos;t want it to.
          </div>
          <Button onClick={toggleDebug}>Toggle Debugging</Button>
          <div className={styles.description}>
            Opens a &quot;developer tools&quot; window which can assist with troubleshooting problems.
          </div>
        </div>
      </div>
      <div className={styles.close}>
        <button onClick={closePanel}>&lt; Close</button>
      </div>
    </div>
  );
};
