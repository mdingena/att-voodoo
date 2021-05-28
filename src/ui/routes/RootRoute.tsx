import { useAtom } from 'jotai';
import { appStageAtom, AppStage } from '@/atoms';
import { SplashScreen } from '@/components/SplashScreen';
import { LoginScreen } from '@/components/LoginScreen';
import { Authenticating, AuthenticatingStage } from '@/components/Authenticating';

export const RootRoute = () => {
  const [appStage] = useAtom(appStageAtom);

  console.log({ appStage: AppStage[appStage] });

  switch (appStage) {
    case AppStage.Ready:
      return <LoginScreen />;

    case AppStage.Authenticating:
      return <Authenticating stage={AuthenticatingStage.Authenticating} />;

    case AppStage.Splash:
    case AppStage.Loading:
    default:
      return <SplashScreen />;
  }
};
