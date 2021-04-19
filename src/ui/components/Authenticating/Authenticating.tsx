import { ipcRenderer } from 'electron';
import { useRef, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../AltaAuth';

export const Authenticating = () => {
  const history = useHistory();
  const auth = useAuth();
  const handle = useRef<NodeJS.Timeout | null>(null);
  const isFetching = useRef(false);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);

  useEffect(() => {
    if (auth?.userData) {
      /*handle.current = setTimeout(() => {
        history.replace('/');
      }, 1700);*/
    }
  }, [auth?.userData]);

  console.log('rerendered', { auth });

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

  if (fatalError) {
    return (
      <>
        <big>Something went wrong. Please restart Voodoo.</big>
        <pre>{fatalError}</pre>
      </>
    );
  }

  if (accountId) {
    console.log('### GOT ACCOUNT ID');
    if (!handle.current) {
      handle.current = setTimeout(() => {
        history.replace('/');
      }, 3000);
    }
    return <big>All done. Redirecting to dashboard now!</big>;
  }

  if (auth?.userData) {
    console.log('### AUTHED');
    return <big>Retrieving account details&hellip; Almost there.</big>;
  }

  console.log('### AUTHING');
  return <big>Authenticating&hellip; Hang on.</big>;
};
