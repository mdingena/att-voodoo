import { ipcRenderer } from 'electron';
import { useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { useHistory } from 'react-router-dom';
import { appStageAtom, AppStage } from '@/atoms';
import { useAuth } from '@/components/AltaAuth';

export const Authenticating = () => {
  const history = useHistory();
  const auth = useAuth();
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const isFetching = useRef(false);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [appStage, setAppStage] = useAtom(appStageAtom);

  if (fatalError) {
    return (
      <>
        <big>Something went wrong. Please restart Voodoo.</big>
        <pre>{fatalError}</pre>
      </>
    );
  }

  if (accountId) {
    if (!timeout.current) {
      setAppStage(AppStage.WaitingForServer);
      timeout.current = setTimeout(() => {
        history.replace('/');
      }, 1700);
    }
    return <big>All done. Redirecting to dashboard now!</big>;
  }

  if (auth?.userData && !isFetching.current) {
    isFetching.current = true;
    ipcRenderer
      .invoke('session', {
        accountId: auth.userData?.profile?.sub,
        accessToken: auth.userData?.access_token
      })
      .then(response => {
        console.log({ response });
        if (response.ok) {
          setAccountId(response.result.accountId);
        } else {
          console.error(response.error);
          setFatalError(response.error);
        }
      });
  }

  if (auth?.userData) {
    return <big>Retrieving account details&hellip; Almost there.</big>;
  }

  window.altaApi.oidc.signinCallback();

  return <big>Authenticating&hellip; Hang on.</big>;
};
