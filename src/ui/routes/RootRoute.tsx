import { useAtom } from 'jotai';
import { appStageAtom, AppStage } from '@/atoms';
import { SplashScreen } from '@/components/SplashScreen';

export const RootRoute = () => {
  const [appStage] = useAtom(appStageAtom);

  console.log({ appStage: AppStage[appStage] });

  switch (appStage) {
    case AppStage.Splash:
    case AppStage.Loading:
    default:
      return <SplashScreen />;
  }
};
