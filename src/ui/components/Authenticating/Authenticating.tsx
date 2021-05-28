import styles from './Authenticating.module.css';

export enum AuthenticatingStage {
  Authenticating,
  ExchangingToken,
  CreatingSession
}

interface AuthenticatingProps {
  stage: AuthenticatingStage;
  message: string;
}

export const Authenticating = ({ stage, message }: AuthenticatingProps) => (
  <div className={styles.center}>{message}</div>
);
