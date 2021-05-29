import { ipcRenderer } from 'electron';
import { Providers } from '@/providers';
import { Switch, Route } from 'react-router-dom';
import { RootRoute } from '@/routes';
import { AuthCallbackRoute } from '@/routes';
import styles from './App.module.css';

ipcRenderer.on('speech-exit', (_, reason) => {
  console.log(reason);
});

ipcRenderer.on('speech-error', (_, reason, error) => {
  console.log(reason, error);
});

ipcRenderer.on('speech-recognised', (_, recognisedSpeech) => {
  console.log({ recognisedSpeech });
});

export const App = () => (
  <Providers>
    <div className={styles.root}>
      <Switch>
        <Route exact path='/' component={RootRoute} />
        <Route path='/auth-callback' component={AuthCallbackRoute} />
      </Switch>
    </div>
  </Providers>
);
