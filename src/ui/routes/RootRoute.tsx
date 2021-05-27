import { useAtom } from 'jotai';
import { appStageAtom, AppStage } from '@/atoms';
import { SplashScreen } from '@/components/SplashScreen';
import { LoginScreen } from '@/components/LoginScreen';

export const RootRoute = () => {
  const [appStage] = useAtom(appStageAtom);

  console.log({ appStage: AppStage[appStage] });

  switch (appStage) {
    case AppStage.Ready:
      return <LoginScreen />;

    case AppStage.Splash:
    case AppStage.Loading:
    default:
      return <SplashScreen />;
  }
};
