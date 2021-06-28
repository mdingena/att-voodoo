import { useAtom } from 'jotai';
import { Panel, panelAtom, SpeechMode, speechModeAtom } from '@/atoms';
import styles from './SettingsPanel.module.css';

export const SettingsPanel = (): JSX.Element => {
  const [panel, setPanel] = useAtom(panelAtom);
  const [, setSpeechMode] = useAtom(speechModeAtom);

  const closePanel = () => {
    setPanel(Panel.None);
  };

  const toggleLock = () => {
    setSpeechMode(mode => (mode === SpeechMode.Locked ? SpeechMode.Suppressed : SpeechMode.Locked));
  };

  const isOpen = panel === Panel.Settings;

  return (
    <div className={isOpen ? styles.open : styles.closed}>
      <div className={styles.settings}>
        <div>
          <button onClick={toggleLock}>Lock Voodoo</button>
        </div>
        <div>
          Stops all speech recognition. Useful if you notice Voodoo keeps awakening when you don&apos;t want it to.
        </div>
      </div>
      <div>
        <button className={styles.close} onClick={closePanel}>
          &lt;- Close
        </button>
      </div>
    </div>
  );
};
