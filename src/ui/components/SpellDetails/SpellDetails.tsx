import { useState } from 'react';
import { ipcRenderer } from 'electron';
import { useAtom } from 'jotai';
import { experienceAtom, incantationsAtom, studyingAtom, Spell, speechModeAtom, SpeechMode } from '@/atoms';
import { Button } from '../Button';
import { Dock } from '../Dock';
import { UpgradeSpell } from '../UpgradeSpell';
import styles from './SpellDetails.module.css';

enum CastsFrom {
  'eyes' = 'Gaze',
  'mainHand' = 'Main hand',
  'offHand' = 'Off-hand',
  'bothHands' = 'Both hands'
}

interface SpellDetailsProps {
  spellKey: string;
  spell: Spell;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

export const SpellDetails = ({ spellKey, spell, onClose }: SpellDetailsProps): JSX.Element => {
  const [isUpgradesOpen, setIsUpgradesOpen] = useState<boolean>(false);
  const [studying, setStudy] = useAtom(studyingAtom);
  const [, setIncantations] = useAtom(incantationsAtom);
  const [experience] = useAtom(experienceAtom);
  const [speechMode] = useAtom(speechModeAtom);

  const closeSpellUpgrade = () => setIsUpgradesOpen(false);

  const openSpellUpgrade = () => setIsUpgradesOpen(true);

  const startStudying = () => {
    setStudy(spellKey);
    setIncantations([]);
    ipcRenderer.invoke('study-spell', spellKey);
  };

  const stopStudying = () => {
    setStudy(null);
    ipcRenderer.invoke('study-spell', null);
  };

  const handleStudyClick = () => {
    if (studying === spellKey) {
      stopStudying();
    } else {
      startStudying();
    }
  };

  const hasIncantations = typeof spell.incantations !== 'undefined';
  const incantations = [];

  if (typeof spell.incantations !== 'undefined') {
    let hasSeal = false;

    for (let i = 0; i < 4; ++i) {
      const incantation = spell.incantations[i];

      if (typeof incantation === 'undefined') {
        if (hasSeal) {
          incantations.push(<Dock key={`dock-${i}`} slot={i as 0 | 1 | 2 | 3} isEmpty />);
        } else {
          incantations.push(<Dock key={`dock-${i}`} slot={i as 0 | 1 | 2 | 3} hint={['SEAL', '']} />);
          hasSeal = true;
        }
      } else {
        incantations.push(<Dock key={`dock-${i}`} slot={i as 0 | 1 | 2 | 3} hint={incantation} />);
      }
    }
  }

  return (
    <>
      <div className={styles.root}>
        <div className={styles.header}>{spell.name}</div>
        <div className={styles.details}>
          <div className={styles.school}>{spell.school}</div>
          <div className={styles.type}>{spell.requiresPreparation ? 'Prepared' : 'Instant'}</div>
          {typeof spell.castsFrom === 'undefined' ? null : (
            <div className={styles.castsFrom}>{CastsFrom[spell.castsFrom]}</div>
          )}
          <div className={styles.description}>{spell.description}</div>
          {hasIncantations ? (
            <div className={styles.incantations}>{incantations}</div>
          ) : (
            <div className={styles.discover}>
              <p>This spell&apos;s incantations are unknown. You can study this spell to discover its incantations.</p>
              <Button onClick={handleStudyClick} isBusy={speechMode === SpeechMode.Incanting}>
                {speechMode === SpeechMode.Incanting
                  ? 'Finish incanting'
                  : studying === spellKey
                  ? 'Stop studying'
                  : 'Study spell'}
              </Button>
            </div>
          )}
        </div>
        <div className={styles.actionsHeader}>
          <button className={styles.action} onClick={onClose}>
            &lt; Back
          </button>
          <button
            className={styles.action}
            onClick={openSpellUpgrade}
            disabled={Object.keys(spell.upgrades).length === 0}
          >
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
