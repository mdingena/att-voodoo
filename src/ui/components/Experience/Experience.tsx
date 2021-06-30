import styles from './Experience.module.css';

const XP_PER_LEVEL = 1000;

interface ExperienceProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  school: string;
  total: number;
  spent: number;
}

export const Experience = ({ onClick, school, total, spent }: ExperienceProps): JSX.Element => {
  const budget = Math.floor(Math.max(0, total - spent) / XP_PER_LEVEL);
  const level = Math.floor(total / XP_PER_LEVEL);
  const progress = total - level * XP_PER_LEVEL;
  const width = (progress / XP_PER_LEVEL) * 100;

  return (
    <button className={styles.root} onClick={onClick}>
      <div className={styles.level}>{level}</div>
      <div className={styles.experience}>
        <div className={styles.school}>{school}</div>
        <div className={styles.progress}>
          <div className={styles.track}>
            <div className={styles.bar} style={{ width: `${width}%` }}></div>
          </div>
          <div className={styles.xp}>
            {progress}
            <span>xp</span>
          </div>
          <div className={styles.budget}>
            {budget}
            <span>+</span>
          </div>
        </div>
      </div>
    </button>
  );
};
