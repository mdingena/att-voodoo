import styles from './Button.module.css';

interface ButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

export const Button = ({ onClick, children }: ButtonProps): JSX.Element => {
  return (
    <button className={styles.root} onClick={onClick}>
      {children}
    </button>
  );
};
