import { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { School, UpgradeConfig } from '@/atoms';
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
    setIsUpgrading(true);
    ipcRenderer.invoke('upgrade', { school, spell, upgrade });
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
              <span className={styles.effect}>!</span> This effect is maxed out!
            </div>
          ) : (
            <>
              <div>
                <span className={styles.effect}>Upgrade</span>{' '}
                {isStepFunction ? upgradedAttribute : upgradedAttribute.toFixed(2)}{' '}
                {upgradedAttribute === 1 ? unit : units}
              </div>
              {isStepFunction && upgradesRequired > 1 && (
                <div>
                  <span className={styles.effect}>!</span> You need {upgradesRequired} more boosts to upgrade.
                </div>
              )}
            </>
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
            {upgradesRequired > 1 ? 'Boost' : 'Upgrade'}
          </button>
        </div>
      </div>
    </div>
  );
};
