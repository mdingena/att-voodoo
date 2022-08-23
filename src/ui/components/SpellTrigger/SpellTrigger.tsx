import { useAtom } from 'jotai';
import { PreparedSpell, speechModeAtom, SpeechMode } from '@/atoms';
import styles from './SpellTrigger.module.css';

interface SpellTriggerProps {
  spell: PreparedSpell;
}

export const SpellTrigger = ({ spell }: SpellTriggerProps): JSX.Element => {
  const [speechMode] = useAtom(speechModeAtom);

  const { name, school, verbalTrigger, charges } = spell;
  const triggerStyle = { opacity: Number(speechMode === SpeechMode.Awake) };

  return (
    <div className={styles.root}>
      <div className={styles.name}>
        {name} <span className={styles.charges}>×{charges ?? 1}</span>
      </div>
      <div className={styles.trigger} style={triggerStyle}>
        Cast with “{school === 'sanguinem magicae' ? 'EXCIO' : 'EVOKE'} {verbalTrigger.toUpperCase()}”
      </div>
    </div>
  );
};
