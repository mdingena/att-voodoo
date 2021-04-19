import { HashRouter, Switch, Route, Link } from 'react-router-dom';
import { AuthProvider, LoginButton } from '@/components/AltaAuth';
import { Authenticating } from '@/components/Authenticating';

export const Routes = () => (
  <HashRouter>
    <AuthProvider
      config={{
        client_id: 'client_30dd429d-6d00-4d83-98c1-c159f5ec2b92',
        scope: 'openid',
        redirect_uri: 'att-voodoo://auth-callback'
      }}
    >
      <Switch>
        <Route
          exact
          path='/'
          render={() => (
            <div>
              Home <LoginButton />
            </div>
          )}
        />
        <Route path='/auth-callback' component={Authenticating} />
      </Switch>
    </AuthProvider>
  </HashRouter>
);
