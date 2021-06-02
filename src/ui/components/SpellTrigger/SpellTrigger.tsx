import { useAtom } from 'jotai';
import { PreparedSpell, speechModeAtom, SpeechMode } from '@/atoms';
import styles from './SpellTrigger.module.css';

interface SpellTriggerProps {
  spell: PreparedSpell;
}

export const SpellTrigger = ({ spell }: SpellTriggerProps) => {
  const [speechMode] = useAtom(speechModeAtom);

  const { name, verbalTrigger } = spell;
  const triggerStyle = { opacity: Number(speechMode === SpeechMode.Awake) };

  return (
    <div className={styles.root}>
      <div className={styles.name}>{name}</div>
      <div className={styles.trigger} style={triggerStyle}>
        Cast with “EVOKE {verbalTrigger.toUpperCase()}”
      </div>
    </div>
  );
};
