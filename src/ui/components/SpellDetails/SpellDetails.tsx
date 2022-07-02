import { useState } from 'react';
import { useAtom } from 'jotai';
import { studyingAtom, experienceAtom, Spell } from '@/atoms';
import { Dock } from '../Dock';
import { UpgradeSpell } from '../UpgradeSpell';
import styles from './SpellDetails.module.css';
import { Button } from '../Button';

interface SpellDetailsProps {
  spellKey: string;
  spell: Spell;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

export const SpellDetails = ({ spellKey, spell, onClose }: SpellDetailsProps): JSX.Element => {
  const [isUpgradesOpen, setIsUpgradesOpen] = useState<boolean>(false);
  const [studying, setStudy] = useAtom(studyingAtom);
  const [experience] = useAtom(experienceAtom);

  const closeSpellUpgrade = () => setIsUpgradesOpen(false);

  const openSpellUpgrade = () => setIsUpgradesOpen(true);

  const startStudying = () => setStudy(spellKey);

  const stopStudying = () => setStudy(null);

  const handleStudyClick = () => {
    if (studying === spellKey) {
      stopStudying();
    } else {
      startStudying();
    }
  };

  return (
    <>
      <div className={styles.root}>
        <div className={styles.header}>{spell.name}</div>
        <div className={styles.details}>
          <div className={styles.school}>{spell.school}</div>
          <div className={styles.type}>{spell.requiresPreparation ? 'Prepared' : 'Instant'}</div>
          <div className={styles.description}>{spell.description}</div>
          {spell.isDiscovered ? (
            <div className={styles.incantations}>
              {spell.incantations.map(([verbalComponent, materialComponent], index) => (
                <Dock
                  key={`dock-${index}`}
                  slot={index as 0 | 1 | 2 | 3}
                  verbalComponentHint={verbalComponent}
                  materialComponentHint={materialComponent}
                />
              ))}
            </div>
          ) : (
            <div className={styles.discover}>
              <p>This spell&apos;s incantations are unknown. You can study this spell to discover its incantations.</p>
              <Button onClick={handleStudyClick}>{studying === spellKey ? 'Stop studying' : 'Study spell'}</Button>
            </div>
          )}
        </div>
        <div className={styles.actionsHeader}>
          <button className={styles.action} onClick={onClose}>
            &lt; Back
          </button>
          <button className={styles.action} onClick={openSpellUpgrade}>
            Upgrade
          </button>
        </div>
      </div>
      {isUpgradesOpen && (
        <UpgradeSpell
          spellKey={spellKey}
          spell={spell}
          upgrades={experience.upgrades[spellKey] ?? {}}
          onClose={closeSpellUpgrade}
        />
      )}
    </>
  );
};
