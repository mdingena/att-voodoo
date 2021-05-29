import { useAtom } from 'jotai';
import { appStageAtom, AppStage } from '@/atoms';
import { SplashScreen } from '@/components/SplashScreen';
import { LoginScreen } from '@/components/LoginScreen';
import { Authenticating, AuthenticatingStage } from '@/components/Authenticating';
import { ServersScreen } from '@/components/ServersScreen';
import { Dashboard } from '@/components/Dashboard';

export const RootRoute = () => {
  const [appStage] = useAtom(appStageAtom);

  console.log({ appStage: AppStage[appStage] });

  switch (appStage) {
    case AppStage.Connected:
      return <Dashboard />;

    case AppStage.WaitingForServer:
      return <ServersScreen />;

    case AppStage.Authenticating:
      return <Authenticating stage={AuthenticatingStage.Authenticating} />;

    case AppStage.Ready:
      return <LoginScreen />;

    case AppStage.Splash:
    case AppStage.Loading:
    default:
      return <SplashScreen />;
  }
};
