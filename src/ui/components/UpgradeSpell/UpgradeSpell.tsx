import { useState } from 'react';
import { Spell, SpellUpgrades, UpgradeConfig } from '@/atoms';
import { UpgradeModal } from '../UpgradeModal';
import styles from './UpgradeSpell.module.css';

interface UpgradeSpellProps {
  spellKey: string;
  spell: Spell;
  upgrades: SpellUpgrades;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

type SelectedUpgrade = {
  key: string;
  upgradeConfig: UpgradeConfig;
};

export const UpgradeSpell = ({ spellKey, spell, upgrades, onClose }: UpgradeSpellProps): JSX.Element => {
  const [selectedUpgrade, setSelectedUpgrade] = useState<SelectedUpgrade | null>(null);

  const closeModal = () => setSelectedUpgrade(null);

  const selectUpgrade = (selection: SelectedUpgrade) => () => setSelectedUpgrade(selection);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.header}>{spell.name}</div>
        <div className={styles.upgrades}>
          {Object.entries(spell.upgrades).map(([upgradeKey, upgradeConfig]) => (
            <button
              key={upgradeKey}
              className={styles.upgrade}
              onClick={selectUpgrade({ key: upgradeKey, upgradeConfig })}
            >
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
          school={spell.school}
          spellKey={spellKey}
          upgradeKey={selectedUpgrade.key}
          upgradeConfig={selectedUpgrade.upgradeConfig}
          currentLevel={upgrades[selectedUpgrade.key] ?? 0}
          onClose={closeModal}
        />
      )}
    </>
  );
};
