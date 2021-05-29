import { ipcRenderer } from 'electron';
import { useRef, useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useHistory } from 'react-router-dom';
import { appStageAtom, AppStage, activeServerAtom, serversAtom } from '@/atoms';
import { useAuth } from '@/components/AltaAuth';
import { Authenticating, AuthenticatingStage } from '@/components/Authenticating';

export const AuthCallbackRoute = () => {
  const history = useHistory();
  const auth = useAuth();
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const isFetching = useRef(false);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [appStage, setAppStage] = useAtom(appStageAtom);
  const [activeServer, setActiveServer] = useAtom(activeServerAtom);
  const [servers, setServers] = useAtom(serversAtom);

  /* Call Alta auth library. */
  useEffect(() => {
    window.altaApi.oidc.signinCallback();
  }, []);

  /* Automatically redirect shortly after completing auth flow. */
  useEffect(() => {
    if (accountId && appStage !== AppStage.WaitingForServer) {
      setAppStage(AppStage.WaitingForServer);
    } else if (accountId && appStage === AppStage.WaitingForServer && !timeout.current) {
      timeout.current = setTimeout(() => {
        history.replace('/');
      }, 2700);
    }
  }, [accountId, appStage]);

  if (fatalError) return <Authenticating stage={AuthenticatingStage.FatalError} error={fatalError} />;

  if (appStage === AppStage.WaitingForServer) return <Authenticating stage={AuthenticatingStage.Ready} />;

  if (accountId) return <Authenticating stage={AuthenticatingStage.CreatingSession} />;

  if (auth?.userData && !isFetching.current) {
    isFetching.current = true;
    ipcRenderer
      .invoke('session', {
        accountId: auth.userData?.profile?.sub,
        accessToken: auth.userData?.access_token
      })
      .then(response => {
        if (response.ok) {
          setActiveServer(response.result.playerJoined);
          setServers(response.result.servers);
          setAccountId(response.result.accountId);
        } else {
          console.error(response.error);
          setFatalError(response.error);
        }
      });
  }

  if (auth?.userData) return <Authenticating stage={AuthenticatingStage.ExchangingToken} />;

  return <Authenticating stage={AuthenticatingStage.Authenticating} />;
};
