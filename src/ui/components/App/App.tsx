import { ipcRenderer } from 'electron';
import { Providers } from '@/providers';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useAtom } from 'jotai';
import { RootRoute } from '@/routes';
import { AuthCallbackRoute } from '@/routes';
import { hasSessionAtom } from '@/atoms';
import styles from './App.module.css';

ipcRenderer.on('speech-exit', (_, reason) => {
  console.log(reason);
});

ipcRenderer.on('speech-error', (_, reason, error) => {
  console.log(reason, error);
});

export const App = (): JSX.Element => {
  const [hasSession] = useAtom(hasSessionAtom);

  return (
    <Providers>
      <div className={styles.root}>
        <Switch>
          <Route exact path='/' component={RootRoute} />
          {hasSession ? (
            <Redirect from='/auth-callback' to='/' />
          ) : (
            <Route path='/auth-callback' component={AuthCallbackRoute} />
          )}
        </Switch>
      </div>
    </Providers>
  );
};
