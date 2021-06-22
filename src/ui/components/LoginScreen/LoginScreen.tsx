import { useRef, useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { appStageAtom, AppStage } from '@/atoms';
import { Logo } from '@/components/Logo';
import { LoginButton } from '@/components/AltaAuth';
import styles from './LoginScreen.module.css';
import packageJson from '@/../../package.json';

export const LoginScreen = () => {
  const transition = useRef<NodeJS.Timeout | null>(null);
  const [isSplashFinished, finishSplash] = useState(false);
  const [appStage, setAppStage] = useAtom(appStageAtom);

  /**
   * Show the splash screen for at least 4 seconds, even if libraries
   * load faster than that.
   */
  useEffect(() => {
    setTimeout(() => {
      finishSplash(true);
    }, 4000);
  }, []);

  useEffect(() => {
    if (!transition.current && isSplashFinished && appStage === AppStage.Splash) {
      transition.current = setTimeout(() => {
        setAppStage(AppStage.Ready);
      }, 1000);
    }
  }, [isSplashFinished, appStage]);

  return (
    <div className={styles.root}>
      <div className={styles.logo}>
        <Logo />
      </div>
      {appStage === AppStage.Ready ? (
        <div className={styles.login} style={{ opacity: 1 }}>
          <span className={styles.title}>Voodoo</span>
          <span className={styles.subtitle}>
            Magic Mod for
            <br />A Township Tale
          </span>
          <LoginButton />
        </div>
      ) : (
        <div className={styles.loading} style={{ opacity: isSplashFinished ? 0 : 1 }}>
          Loading&hellip;
        </div>
      )}
      <div className={styles.footer}>
        <div className={styles.version}>v{packageJson.version} by&nbsp;Ethyn&nbsp;Wyrmbane</div>
        <div>
          Crystal art by{' '}
          <a className={styles.link} href='https://twitter.com/ubizozo' title="UbiZoZo's Twitter">
            @UbiZoZo
          </a>
        </div>
      </div>
    </div>
  );
};
