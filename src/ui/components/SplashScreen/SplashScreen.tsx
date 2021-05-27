import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { appStageAtom, AppStage, loadingMessageAtom } from '@/atoms';
import styles from './SplashScreen.module.css';

/**
 * Show the splash screen while the app is loading external libraries.
 * Show the splash screen for at least 4 seconds, even if libraries
 * load faster than that.
 */
export const SplashScreen = () => {
  const [isSplashFinished, finishSplash] = useState(false);
  const [appStage, setAppStage] = useAtom(appStageAtom);
  const [loadingMessage] = useAtom(loadingMessageAtom);

  useEffect(() => {
    setTimeout(() => {
      finishSplash(true);
    }, 4000);
  }, []);

  useEffect(() => {
    if (isSplashFinished && appStage === AppStage.Splash) {
      setAppStage(AppStage.Ready);
    }
  }, [isSplashFinished, appStage]);

  return <div className={styles.center}>{loadingMessage}</div>;
};
