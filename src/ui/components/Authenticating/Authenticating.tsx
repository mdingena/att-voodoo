import styles from './Authenticating.module.css';

export enum AuthenticatingStage {
  Authenticating,
  ExchangingToken,
  CreatingSession,
  Ready,
  FatalError
}

interface AuthenticatingProps {
  stage: AuthenticatingStage;
  error?: string;
}

export const Authenticating = ({ stage, error }: AuthenticatingProps): JSX.Element | null => {
  switch (stage) {
    case AuthenticatingStage.Authenticating:
      return (
        <div className={styles.center}>
          <span>Authenticating&hellip;</span>
          <small className={styles.instructions}>
            <br />
            Please check your browser window to sign in to your Alta Account.
          </small>
        </div>
      );

    case AuthenticatingStage.ExchangingToken:
      return (
        <div className={styles.center}>
          <span>Exchanging token&hellip;</span>
          <small className={styles.instructions}>
            <br />
            Voodoo is retrieving an access token from Alta.
          </small>
        </div>
      );

    case AuthenticatingStage.CreatingSession:
      return (
        <div className={styles.center}>
          <span>Creating session&hellip;</span>
          <small className={styles.instructions}>
            <br />
            Voodoo is creating your play session.
          </small>
        </div>
      );

    case AuthenticatingStage.Ready:
      return (
        <div className={styles.center}>
          <span>Ready!</span>
          <small className={styles.instructions}>
            <br />
            What Voodoo will you do?
          </small>
        </div>
      );

    case AuthenticatingStage.FatalError:
      return (
        <div className={styles.center}>
          <span>Oops!</span>
          <small className={styles.instructions}>
            <br />
            Something went wrong.
            <br />
            Please restart Voodoo.
          </small>
          {error && (
            <>
              <br />
              <small className={styles.error}>{error}</small>
            </>
          )}
        </div>
      );

    default:
      return null;
  }
};
