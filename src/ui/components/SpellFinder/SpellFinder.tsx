import { useAtom } from 'jotai';
import { experienceAtom, spellbookAtom, School } from '@/atoms';
import styles from './SpellFinder.module.css';

interface SpellFinderProps {
  school: School;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

export const SpellFinder = ({ school, onClose }: SpellFinderProps): JSX.Element => {
  const [spellbook] = useAtom(spellbookAtom);
  const [experience] = useAtom(experienceAtom);

  const spells = Object.values(spellbook).filter(
    upgradeConfig => upgradeConfig.school === school && Object.keys(upgradeConfig.upgrades).length
  );
  const { upgrades } = experience;

  return (
    <div className={styles.root}>
      <div className={styles.spells}>
        {spells.map(spell => (
          <div key={spell.name}>{spell.name}</div>
        ))}
      </div>
      <div>
        <button className={styles.close} onClick={onClose}>
          &lt; Back
        </button>
      </div>
    </div>
  );
};
