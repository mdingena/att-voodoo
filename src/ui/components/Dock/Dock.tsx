import { useAtom } from 'jotai';
import { speechModeAtom, SpeechMode, incantationsAtom, StudyFeedback } from '@/atoms';
import styles from './Dock.module.css';

enum Slot {
  ζ = 0,
  δ = 1,
  λ = 2,
  Ω = 3
}

interface DockProps {
  slot: 0 | 1 | 2 | 3;
  studying?: string | null;
  hint?: [string, string];
}

export const Dock = ({ slot, studying, hint }: DockProps): JSX.Element => {
  const [speechMode] = useAtom(speechModeAtom);
  const [incantations] = useAtom(incantationsAtom);

  const isStudying = typeof studying !== 'undefined' && studying !== null;
  const isHinting = typeof hint !== 'undefined';
  const isIncanting = speechMode === SpeechMode.Incanting;
  const isActiveDock = isIncanting && slot === incantations.length;

  const dockIncantation = incantations[slot] ?? null;
  const dockVerbalComponent = dockIncantation?.[0]?.toUpperCase();
  const dockMaterialComponent = dockIncantation?.[1];
  const dockStudyFeedback = dockIncantation?.[2];

  let dockStyle, dockIcon, verbalComponent, materialComponent;

  if (isActiveDock) {
    dockStyle = styles.active;
    dockIcon = Slot[slot];
    verbalComponent = isHinting ? `Say “${hint?.[0]?.toUpperCase()}”` ?? '' : 'Speak an incantation or';
    materialComponent = isHinting ? hint?.[1] ?? '' : 'say “SEAL” or “NULLIFY”.';
  } else {
    if (isHinting) {
      const isMatch = incantations[slot]?.[0] === hint?.[0] && incantations[slot]?.[1] === hint?.[1];
      const filledStyle = isMatch ? styles.filled : styles.feedbackMismatch;
      dockStyle = incantations[slot] ? filledStyle : styles.disabled;
      dockIcon = incantations[slot] ? (isMatch ? Slot[slot] : 'Χ') : Slot[slot];
      verbalComponent = dockVerbalComponent ?? `“${hint?.[0]?.toUpperCase()}”`;
      materialComponent = dockMaterialComponent ?? hint?.[1];
    } else if (isStudying) {
      switch (dockStudyFeedback) {
        case StudyFeedback.Match:
          dockStyle = styles.feedbackMatch;
          dockIcon = 'Ξ';
          break;

        case StudyFeedback.Partial:
          dockStyle = styles.feedbackPartial;
          dockIcon = 'θ';
          break;

        case StudyFeedback.Mismatch:
          dockStyle = styles.feedbackMismatch;
          dockIcon = 'Χ';
          break;

        default:
          dockStyle = isIncanting && incantations[slot] ? styles.filled : styles.disabled;
          dockIcon = Slot[slot];
      }

      verbalComponent = dockVerbalComponent && `“${dockVerbalComponent?.toUpperCase()}”`;
      materialComponent = dockMaterialComponent;
    } else {
      dockStyle = isIncanting && incantations[slot] ? styles.filled : styles.disabled;
      dockIcon = Slot[slot];
      verbalComponent = dockVerbalComponent && `“${dockVerbalComponent?.toUpperCase()}”`;
      materialComponent = dockMaterialComponent;
    }
  }

  return (
    <div className={dockStyle}>
      <div className={styles.dock}>
        <span className={styles.slot}>{dockIcon}</span>
      </div>
      <div className={styles.description}>
        {verbalComponent}
        <br />
        {materialComponent}
      </div>
    </div>
  );
};
