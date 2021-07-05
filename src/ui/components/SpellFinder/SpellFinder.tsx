import { useState } from 'react';
import { useAtom } from 'jotai';
import { experienceAtom, spellbookAtom, School, Spell } from '@/atoms';
import { UpgradeSpell } from '../UpgradeSpell';
import styles from './SpellFinder.module.css';

interface SpellFinderProps {
  school: School;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

type SelectedSpell = {
  key: string;
  spell: Spell;
};

export const SpellFinder = ({ school, onClose }: SpellFinderProps): JSX.Element => {
  const [selectedSpell, setSelectedSpell] = useState<SelectedSpell | null>(null);
  const [spellbook] = useAtom(spellbookAtom);
  const [experience] = useAtom(experienceAtom);

  const closeSpellUpgrade = () => setSelectedSpell(null);

  const selectSpellUpgrade = (selection: SelectedSpell) => () => setSelectedSpell(selection);

  const spells = Object.entries(spellbook).filter(
    ([, spell]) => spell.school === school && Object.keys(spell.upgrades).length
  );

  return (
    <>
      <div className={styles.root}>
        <div className={styles.header}>{school}</div>
        <div className={styles.spells}>
          {spells.map(([spellKey, spell]) => {
            const upgrades = Object.values(experience.upgrades[spellKey] ?? {}).reduce(
              (sum, upgrade) => sum + upgrade,
              0
            );

            return (
              <button key={spellKey} className={styles.spell} onClick={selectSpellUpgrade({ key: spellKey, spell })}>
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
          spellKey={selectedSpell.key}
          spell={selectedSpell.spell}
          upgrades={experience.upgrades[selectedSpell.key] ?? {}}
          onClose={closeSpellUpgrade}
        />
      )}
    </>
  );
};
