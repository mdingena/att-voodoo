import { useState } from 'react';
import { ipcRenderer } from 'electron';
import { useAtom } from 'jotai';
import { accessTokenAtom, experienceAtom } from '@/atoms';
import styles from './ResetModal.module.css';

interface ResetModalProps {
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  onComplete: () => void;
}

export const ResetModal = ({ onClose, onComplete }: ResetModalProps): JSX.Element => {
  const [accessToken] = useAtom(accessTokenAtom);
  const [experience, setExperience] = useAtom(experienceAtom);

  const [fatalError, setFatalError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const hasFreeResets = experience.freeResets > 0;

  const submitReset = () => {
    setFatalError(null);
    setIsResetting(true);
    ipcRenderer
      .invoke('reset-upgrades', { accessToken, useFreeReset: hasFreeResets })
      .then(response => {
        if (response.ok) {
          setExperience(response.result);
          onComplete();
        } else {
          console.error(response.error);
          setFatalError(response.error);
        }
        setIsResetting(false);
      })
      .catch(error => {
        console.error(JSON.stringify(error, null, 2));
        setFatalError(error.message);
        setIsResetting(false);
      });
  };

  const costText = hasFreeResets
    ? `and your free resets will be reduced to ${experience.freeResets - 1}`
    : 'minus a reset fee of 10% across all magic schools';

  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <div className={styles.header}>Confirm Reset</div>
        <div className={styles.details}>
          You are about to reset all your spell upgrades. You will be refunded all your accumulated XP {costText}.
          {fatalError ? <div className={styles.error}>{fatalError}</div> : <div className={styles.empty}>&nbsp;</div>}
        </div>
        <div className={styles.actions}>
          <button className={styles.action} onClick={onClose} disabled={isResetting}>
            Cancel
          </button>
          <button className={styles.action} onClick={submitReset} disabled={isResetting}>
            {fatalError ? 'Retry' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
