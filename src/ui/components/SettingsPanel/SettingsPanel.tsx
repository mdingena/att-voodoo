import { useCallback, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useAtom } from 'jotai';
import {
  Panel,
  panelAtom,
  SpeechMode,
  speechModeAtom,
  dexterityAtom,
  EvokeHandedness,
  EvokeAngle,
  accessTokenAtom,
  experienceAtom
} from '@/atoms';
import { Button } from '../Button';
import { ResetModal } from '../ResetModal';
import styles from './SettingsPanel.module.css';

export const SettingsPanel = (): JSX.Element => {
  const [accessToken] = useAtom(accessTokenAtom);
  const [panel, setPanel] = useAtom(panelAtom);
  const [speechMode, setSpeechMode] = useAtom(speechModeAtom);
  const [dexterity, setDexterity] = useAtom(dexterityAtom);
  const [experience] = useAtom(experienceAtom);
  const [isBusy, setBusy] = useState<boolean>(false);
  const [isResetModalOpen, setResetModalOpen] = useState<boolean>(false);

  const closePanel = () => {
    setPanel(Panel.None);
  };

  const toggleLock = () => {
    setSpeechMode(mode => (mode === SpeechMode.Locked ? SpeechMode.Suppressed : SpeechMode.Locked));
  };

  const setEvokeHand = useCallback(
    async (hand: EvokeHandedness) => {
      setBusy(true);

      const angle = dexterity[1];

      await ipcRenderer.invoke('apply-settings', {
        accessToken,
        settings: { dexterity: `${hand}Hand/${angle}` }
      });

      setDexterity([hand, angle]);
      setBusy(false);
    },
    [accessToken, dexterity, setDexterity]
  );

  const setEvokeAngle = useCallback(
    async (angle: EvokeAngle) => {
      setBusy(true);

      const hand = dexterity[0];

      await ipcRenderer.invoke('apply-settings', {
        accessToken,
        settings: { dexterity: `${hand}Hand/${angle}` }
      });

      setDexterity([hand, angle]);
      setBusy(false);
    },
    [accessToken, dexterity, setDexterity]
  );

  const openResetModal = () => {
    setResetModalOpen(true);
  };

  const closeResetModal = () => {
    setResetModalOpen(false);
  };

  const toggleDebug = () => {
    ipcRenderer.invoke('toggle-dev-tools');
  };

  useEffect(() => {
    ipcRenderer.invoke('speech-lock', speechMode === SpeechMode.Locked);
  }, [speechMode]);

  const isOpen = panel === Panel.Settings;
  const { freeResets } = experience;
  const hasFreeResets = freeResets > 0;

  return (
    <>
      <div className={isOpen ? styles.open : styles.closed}>
        <div>
          <div className={styles.header}>Settings</div>
          <div className={styles.settings}>
            <Button onClick={toggleLock}>{speechMode === SpeechMode.Locked ? 'Unlock' : 'Lock'} Voodoo</Button>
            <div className={styles.description}>
              Stops all speech recognition. Useful if you notice Voodoo keeps awakening when you don&apos;t want it to.
            </div>
            <div className={styles.group}>
              <Button isBusy={isBusy} isMuted={dexterity[0] === 'right'} onClick={() => setEvokeHand('left')}>
                Left
              </Button>
              <Button isBusy={isBusy} isMuted={dexterity[0] === 'left'} onClick={() => setEvokeHand('right')}>
                Right
              </Button>
            </div>
            <div className={styles.description}>
              Sets preferred &quot;main hand&quot; for casting spells. Some spells also use your &quot;off-hand&quot;,
              as described in their spell description.
            </div>
            <div className={styles.group}>
              <Button isBusy={isBusy} isMuted={dexterity[1] === 'palm'} onClick={() => setEvokeAngle('index')}>
                Finger
              </Button>
              <Button isBusy={isBusy} isMuted={dexterity[1] === 'index'} onClick={() => setEvokeAngle('palm')}>
                Palm
              </Button>
            </div>
            <div className={styles.description}>
              Most spells cast from your hand palm regardless of this setting so you can easily grab what you cast.
              However, some projectile spells must be aimed. You can choose to evoke these from your hand palm or index
              finger.
            </div>
            <Button onClick={openResetModal}>Reset upgrades</Button>
            <div className={styles.description}>
              Resets all your spell upgrades for the cost of reducing your XP total by 10%. You currently have{' '}
              {hasFreeResets ? freeResets : 'no'} free reset
              {freeResets === 1 ? '' : 's'} that allow{freeResets === 1 ? 's' : ''} you to avoid paying this cost.
            </div>
            <Button onClick={toggleDebug}>Toggle debugging</Button>
            <div className={styles.description}>
              Opens a &quot;developer tools&quot; window which can assist with troubleshooting problems.
            </div>
          </div>
        </div>
        <div className={styles.close}>
          <button onClick={closePanel}>&lt; Close</button>
        </div>
      </div>
      {isResetModalOpen && <ResetModal onClose={closeResetModal} onComplete={closeResetModal} />}
    </>
  );
};
