import { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useAtom } from 'jotai';
import { accessTokenAtom, experienceAtom, School, UpgradeConfig } from '@/atoms';
import styles from './UpgradeModal.module.css';

const upgradeAttribute = (upgrades: number, { isStepFunction, min, max, constant }: UpgradeConfig): number => {
  const attribute = max - (max - min) * Math.exp(-constant * upgrades);
  return isStepFunction ? Math.round(attribute) : attribute;
};

interface UpgradeModalProps {
  school: School;
  spell: string;
  upgradeConfig: UpgradeConfig;
  currentLevel: number;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

interface SubmitUpgrade {
  school: School;
  spell: string;
  upgrade: string;
}

export const UpgradeModal = ({
  school,
  spell,
  upgradeConfig,
  currentLevel,
  onClose
}: UpgradeModalProps): JSX.Element => {
  const [accessToken] = useAtom(accessTokenAtom);
  const [, setExperience] = useAtom(experienceAtom);

  const [fatalError, setFatalError] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  const currentAttribute = upgradeAttribute(currentLevel, upgradeConfig);
  let upgradedAttribute = currentAttribute;
  let upgradeLevel = currentLevel;

  const { isStepFunction, max, unit, units } = upgradeConfig;
  const maxAttribute = isStepFunction ? Math.round(max) : max;
  const isMaxed = currentAttribute === maxAttribute;

  useEffect(() => {
    setIsUpgrading(false);
  }, [currentLevel]);

  const submitUpgrade = ({ school, spell, upgrade }: SubmitUpgrade) => () => {
    setFatalError(null);
    setIsUpgrading(true);
    ipcRenderer
      .invoke('upgrade', { accessToken, school, spell, upgrade })
      .then(response => {
        if (response.ok) {
          if (response.result === false) {
            console.error('Not enough XP.');
            setFatalError('Not enough XP.');
          } else {
            setExperience(response.result);
          }
        } else {
          console.error(response.error);
          setFatalError(response.error);
        }
        setIsUpgrading(false);
      })
      .catch(error => {
        console.error(JSON.stringify(error, null, 2));
        setFatalError(error.message);
        setIsUpgrading(false);
      });
  };

  if (!isMaxed) {
    if (isStepFunction) {
      /* Find the required level for a "step up". */
      while (currentAttribute === upgradedAttribute)
        upgradedAttribute = upgradeAttribute(++upgradeLevel, upgradeConfig);
    } else {
      upgradedAttribute = upgradeAttribute(++upgradeLevel, upgradeConfig);
    }
  }

  const upgradesRequired = upgradeLevel - currentLevel;

  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <div className={styles.header}>
          {isMaxed ? 'Inspect' : 'Confirm'} {upgradesRequired > 1 ? 'Boost' : 'Upgrade'}
        </div>
        <div className={styles.details}>
          {upgradeConfig.description}
          <div>
            <span className={styles.effect}>Current</span>{' '}
            {isStepFunction ? currentAttribute : currentAttribute.toFixed(2)} {currentAttribute === 1 ? unit : units}
          </div>
          {isMaxed ? (
            <div>
              <span className={styles.effect}>Upgrade</span> This effect is fully upgraded!
            </div>
          ) : (
            <div>
              <span className={styles.effect}>Upgrade</span>{' '}
              {isStepFunction ? upgradedAttribute : upgradedAttribute.toFixed(2)}{' '}
              {upgradedAttribute === 1 ? unit : units}
            </div>
          )}
          {fatalError ? (
            <div className={styles.error}>{fatalError}</div>
          ) : isStepFunction && upgradesRequired > 1 ? (
            <div>
              <span className={styles.effect}>!</span> You need {upgradesRequired} more boosts to upgrade.
            </div>
          ) : (
            <div className={styles.empty}>&nbsp;</div>
          )}
        </div>
        <div className={styles.actions}>
          <button className={styles.action} onClick={onClose} disabled={isUpgrading}>
            Close
          </button>
          <button
            className={styles.action}
            onClick={submitUpgrade({ school, spell, upgrade: upgradeConfig.name })}
            disabled={isMaxed || isUpgrading}
          >
            {fatalError ? 'Retry' : upgradesRequired > 1 ? 'Boost' : 'Upgrade'}
          </button>
        </div>
      </div>
    </div>
  );
};
