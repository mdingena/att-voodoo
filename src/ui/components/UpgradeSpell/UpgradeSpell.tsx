import { Spell, SpellUpgrades } from '@/atoms';
import styles from './UpgradeSpell.module.css';

interface UpgradeSpellProps {
  spell: Spell;
  upgrades: SpellUpgrades;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

export const UpgradeSpell = ({ spell, upgrades, onClose }: UpgradeSpellProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>{spell.name}</div>
      <div className={styles.upgrades}>
        {Object.entries(spell.upgrades).map(([upgradeKey, upgradeConfig]) => (
          <button key={upgradeConfig.name} className={styles.upgrade} onClick={() => undefined}>
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
  );
};
