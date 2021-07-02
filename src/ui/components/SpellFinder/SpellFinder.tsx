import { useState } from 'react';
import { useAtom } from 'jotai';
import { experienceAtom, spellbookAtom, School, Spell } from '@/atoms';
import { UpgradeSpell } from '../UpgradeSpell';
import styles from './SpellFinder.module.css';

interface SpellFinderProps {
  school: School;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

export const SpellFinder = ({ school, onClose }: SpellFinderProps): JSX.Element => {
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [spellbook] = useAtom(spellbookAtom);
  const [experience] = useAtom(experienceAtom);

  const closeSpellUpgrade = () => setSelectedSpell(null);

  const selectSpellUpgrade = (spell: Spell) => () => setSelectedSpell(spell);

  const spells = Object.values(spellbook).filter(
    upgradeConfig => upgradeConfig.school === school && Object.keys(upgradeConfig.upgrades).length
  );

  return (
    <>
      <div className={styles.root}>
        <div className={styles.header}>{school}</div>
        <div className={styles.spells}>
          {spells.map(spell => {
            const upgrades = Object.values(experience.upgrades[spell.name] ?? {}).reduce(
              (sum, upgrade) => sum + upgrade,
              0
            );

            return (
              <button key={spell.name} className={styles.spell} onClick={selectSpellUpgrade(spell)}>
                <span className={styles.upgrades}>{upgrades}</span>
                <span className={styles.name}>{spell.name}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.close}>
          <button onClick={onClose}>&lt; Back</button>
        </div>
      </div>
      {selectedSpell && (
        <UpgradeSpell
          spell={selectedSpell}
          upgrades={experience.upgrades[selectedSpell.name] ?? {}}
          onClose={closeSpellUpgrade}
        />
      )}
    </>
  );
};
