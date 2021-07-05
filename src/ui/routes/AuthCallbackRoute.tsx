import { ipcRenderer } from 'electron';
import { useRef, useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useHistory } from 'react-router-dom';
import {
  appStageAtom,
  AppStage,
  activeServerAtom,
  serversAtom,
  hasSessionAtom,
  accessTokenAtom,
  spellbookAtom
} from '@/atoms';
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
  const [, setActiveServer] = useAtom(activeServerAtom);
  const [, setServers] = useAtom(serversAtom);
  const [hasSession, setHasSession] = useAtom(hasSessionAtom);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [, setSpellbook] = useAtom(spellbookAtom);

  /* Call Alta auth library. */
  useEffect(() => {
    if (hasSession) {
      history.replace('/');
    } else {
      ipcRenderer.invoke('focus');
      window.altaApi.oidc.signinCallback();
    }
  }, [hasSession, history]);

  /* Automatically redirect shortly after completing auth flow. */
  useEffect(() => {
    if (accountId && appStage > AppStage.Authenticating && !timeout.current) {
      timeout.current = setTimeout(() => {
        history.replace('/');
      }, 2700);
    }
  }, [accountId, appStage]);

  if (fatalError) return <Authenticating stage={AuthenticatingStage.FatalError} error={fatalError} />;

  if (appStage > AppStage.Authenticating) return <Authenticating stage={AuthenticatingStage.Ready} />;

  if (accountId) return <Authenticating stage={AuthenticatingStage.CreatingSession} />;

  if (auth?.userData && !isFetching.current) {
    isFetching.current = true;
    ipcRenderer
      .invoke('session', {
        accountId: auth.userData?.profile?.sub,
        accessToken: auth.userData?.access_token
      })
      .then(({ session, spellbook }) => {
        if (session.ok) {
          setHasSession(true);
          setAccessToken(auth.userData?.access_token ?? null);
          setAccountId(Number(auth.userData?.profile?.sub ?? 0));
          setServers(session.result.servers);

          if (spellbook.ok) {
            setSpellbook(spellbook.result);

            if (session.result.playerJoined) {
              ipcRenderer.invoke('server-connected');
              setActiveServer(session.result.playerJoined);
              setAppStage(AppStage.Connected);
            } else {
              setAppStage(AppStage.WaitingForServer);
            }
          } else {
            console.error(spellbook.error);
            setFatalError(spellbook.error);
          }
        } else {
          console.error(session.error);
          setFatalError(session.error);
        }
      })
      .catch(error => {
        console.error(error);
        setFatalError(error);
      });
  }

  if (auth?.userData) return <Authenticating stage={AuthenticatingStage.ExchangingToken} />;

  return <Authenticating stage={AuthenticatingStage.Authenticating} />;
};
