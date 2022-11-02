import { useAtom } from 'jotai';
import { speechModeAtom, SpeechMode, incantationsAtom } from '@/atoms';
import styles from './Dock.module.css';

enum Slot {
  ζ = 0,
  δ = 1,
  λ = 2,
  Ω = 3
}

interface DockProps {
  slot: 0 | 1 | 2 | 3;
  verbalComponentHint?: string;
  materialComponentHint?: string;
}

export const Dock = ({ slot, verbalComponentHint, materialComponentHint }: DockProps): JSX.Element => {
  const [speechMode] = useAtom(speechModeAtom);
  const [incantations] = useAtom(incantationsAtom);

  const isHinting = verbalComponentHint && materialComponentHint;
  const isIncanting = speechMode === SpeechMode.Incanting;
  const isActiveDock = isIncanting && slot === incantations.length;
  const incantingStyle = incantations[slot] ? styles.filled : isHinting ? styles.disabled : styles.empty;
  const dockStyle = isIncanting ? (isActiveDock ? styles.active : incantingStyle) : styles.disabled;

  const dockIncantation = incantations[slot] ?? null;
  const verbalComponent = dockIncantation?.[0].toUpperCase();
  const materialComponent = dockIncantation?.[1];

  return (
    <div className={dockStyle}>
      <div className={styles.dock}>
        <span className={styles.slot}>{Slot[slot]}</span>
      </div>
      <div className={styles.description}>
        {dockIncantation ? (
          <>
            “{verbalComponent}”
            <br />
            {materialComponent}
          </>
        ) : isHinting ? (
          <>
            “{verbalComponentHint?.toUpperCase()}”
            <br />
            {materialComponentHint}
          </>
        ) : isActiveDock ? (
          <>
            Speak an incantation or
            <br />
            say “SEAL” or “NULLIFY”.
          </>
        ) : null}
      </div>
    </div>
  );
};
