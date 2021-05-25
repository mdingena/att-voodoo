import { useAtom } from 'jotai';
import { appStageAtom } from '@/atoms';
import { LoginButton } from '@/components/AltaAuth';

export const DashboardRoute = () => {
  const [appStage, setAppStage] = useAtom(appStageAtom);

  return (
    <>
      Home <LoginButton />
    </>
  );
};
