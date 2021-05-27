import { useAtom } from 'jotai';
import { appStageAtom, AppStage } from '@/atoms';

export const RootRoute = () => {
  const [appStage] = useAtom(appStageAtom);

  console.log({ appStage });

  switch (appStage) {
    case AppStage.Loading:
    default:
      return null;
  }
};
