import styles from './Button.module.css';

interface ButtonProps {
  isBusy?: boolean;
  isMuted?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

export const Button = ({ isBusy = false, isMuted, onClick, children }: ButtonProps): JSX.Element => {
  const classes = [styles.root];

  isBusy && classes.push(styles.busy);
  isMuted && classes.push(styles.muted);

  return (
    <button className={classes.join(' ')} disabled={isBusy} onClick={onClick}>
      {children}
    </button>
  );
};
