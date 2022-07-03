import { useAtom } from 'jotai';
import { speechModeAtom, SpeechMode, incantationsAtom, studyingAtom, StudyFeedback } from '@/atoms';
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
  const [studying] = useAtom(studyingAtom);

  const isHinting = verbalComponentHint && materialComponentHint;
  const isIncanting = speechMode === SpeechMode.Incanting;
  const isActiveDock = isIncanting && slot === incantations.length;

  const dockIncantation = incantations[slot] ?? null;
  const verbalComponent = dockIncantation?.[0].toUpperCase();
  const materialComponent = dockIncantation?.[1];
  const studyFeedback = dockIncantation?.[2];

  const hintingStyle = isHinting ? styles.disabled : styles.empty;
  const submittedStyle = incantations[slot] ? styles.filled : hintingStyle;
  const incantingStyle = isActiveDock ? styles.active : submittedStyle;
  const feedbackStyle =
    typeof studyFeedback === 'undefined'
      ? styles.disabled
      : studyFeedback === StudyFeedback.Match
      ? styles.feedbackMatch
      : studyFeedback === StudyFeedback.Mismatch
      ? styles.feedbackMismatch
      : styles.feedbackPartial;
  const disabledStyle = studying ? feedbackStyle : styles.disabled;

  const dockStyle = isIncanting ? incantingStyle : disabledStyle;

  const dockIcon =
    studying && !isIncanting
      ? typeof studyFeedback === 'undefined'
        ? Slot[slot]
        : studyFeedback === StudyFeedback.Match
        ? 'Ξ'
        : studyFeedback === StudyFeedback.Mismatch
        ? 'Χ'
        : 'θ'
      : Slot[slot];

  return (
    <div className={dockStyle}>
      <div className={styles.dock}>
        <span className={styles.slot}>{dockIcon}</span>
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
