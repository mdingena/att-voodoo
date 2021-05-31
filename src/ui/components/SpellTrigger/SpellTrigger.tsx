import { useAtom } from 'jotai';
import { PreparedSpell, speechModeAtom, SpeechMode } from '@/atoms';
import styles from './SpellTrigger.module.css';

interface SpellTriggerProps {
  spell: PreparedSpell;
}

export const SpellTrigger = ({ spell }: SpellTriggerProps) => {
  const [speechMode] = useAtom(speechModeAtom);

  const { name, verbalTrigger } = spell;
  const trigger = speechMode === SpeechMode.Awake ? `Cast with “EVOKE ${verbalTrigger.toUpperCase()}”` : null;

  return (
    <div className={styles.root}>
      <div className={styles.name}>{name}</div>
      <div className={styles.trigger}>{trigger}</div>
    </div>
  );
};
