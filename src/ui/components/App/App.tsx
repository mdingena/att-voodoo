import { ipcRenderer } from 'electron';
import { Providers } from '@/providers';
import { Switch, Route } from 'react-router-dom';
import { DashboardRoute } from '@/routes';
import { AuthCallbackRoute } from '@/routes';

ipcRenderer.on('speechExit', (_, reason) => {
  console.log(reason);
});

ipcRenderer.on('speechError', (_, reason, error) => {
  console.log(reason, error);
});

ipcRenderer.on('speechData', (_, recognisedSpeech) => {
  console.log({ recognisedSpeech });
});

export const App = () => (
  <Providers>
    <Switch>
      <Route exact path='/' component={DashboardRoute} />
      <Route path='/auth-callback' component={AuthCallbackRoute} />
    </Switch>
  </Providers>
);
