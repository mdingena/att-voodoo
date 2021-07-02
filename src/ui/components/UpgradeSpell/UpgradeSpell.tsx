import { useState } from 'react';
import { Spell, SpellUpgrades, UpgradeConfig } from '@/atoms';
import { UpgradeModal } from '../UpgradeModal';
import styles from './UpgradeSpell.module.css';

interface UpgradeSpellProps {
  spell: Spell;
  upgrades: SpellUpgrades;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

export const UpgradeSpell = ({ spell, upgrades, onClose }: UpgradeSpellProps): JSX.Element => {
  const [selectedUpgrade, setSelectedUpgrade] = useState<UpgradeConfig | null>(null);
  const selectedUpgradeKey =
    (selectedUpgrade && Object.entries(spell.upgrades).find(([, { name }]) => name === selectedUpgrade.name)?.[0]) ??
    '';

  const closeModal = () => setSelectedUpgrade(null);

  const selectUpgrade = (upgradeConfig: UpgradeConfig) => () => setSelectedUpgrade(upgradeConfig);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.header}>{spell.name}</div>
        <div className={styles.upgrades}>
          {Object.entries(spell.upgrades).map(([upgradeKey, upgradeConfig]) => (
            <button key={upgradeConfig.name} className={styles.upgrade} onClick={selectUpgrade(upgradeConfig)}>
              <div className={styles.title}>
                <span className={styles.level}>{upgrades[upgradeKey] ?? 0}</span>
                <span className={styles.name}>{upgradeConfig.name}</span>
              </div>
              <div className={styles.description}>{upgradeConfig.description}</div>
            </button>
          ))}
        </div>
        <div className={styles.close}>
          <button onClick={onClose}>&lt; Back</button>
        </div>
      </div>
      {selectedUpgrade && (
        <UpgradeModal
          upgradeConfig={selectedUpgrade}
          currentLevel={upgrades[selectedUpgradeKey] ?? 0}
          onClose={closeModal}
        />
      )}
    </>
  );
};
