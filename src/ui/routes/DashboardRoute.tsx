import { useAtom } from 'jotai';
import { appStageAtom, AppStage } from '@/atoms';
import { LoginButton } from '@/components/AltaAuth';

export const DashboardRoute = () => {
  const [appStage] = useAtom(appStageAtom);

  return (
    <>
      Home <LoginButton />
      App Stage: {AppStage[appStage]}
    </>
  );
};
