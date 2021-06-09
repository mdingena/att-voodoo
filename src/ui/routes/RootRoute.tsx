import { useAtom } from 'jotai';
import { appStageAtom, AppStage } from '@/atoms';
import { LoginScreen } from '@/components/LoginScreen';
import { Authenticating, AuthenticatingStage } from '@/components/Authenticating';
import { ServersScreen } from '@/components/ServersScreen';
import { Dashboard } from '@/components/Dashboard';

export const RootRoute = () => {
  const [appStage] = useAtom(appStageAtom);

  switch (appStage) {
    case AppStage.Connected:
      return <Dashboard />;

    case AppStage.WaitingForServer:
      return <ServersScreen />;

    case AppStage.Authenticating:
      return <Authenticating stage={AuthenticatingStage.Authenticating} />;

    case AppStage.Ready:
    case AppStage.Splash:
    case AppStage.Loading:
      return <LoginScreen />;
  }
};
