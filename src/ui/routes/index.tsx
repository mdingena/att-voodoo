import { MemoryRouter, Switch, Route, Link } from 'react-router-dom';
import { AuthProvider } from 'oidc-react';

export const Routes = () => (
  <MemoryRouter>
    <AuthProvider
      authority='https://accounts.townshiptale.com/'
      clientId={process.env.ALTA_CLIENT_ID}
      redirectUri='att-voodoo://auth-callback'
    >
      <Switch>
        <Route
          exact
          path='/'
          render={() => (
            <div>
              Home <Link to='/login'>Go to Login</Link>
            </div>
          )}
        />
        <Route
          path='/login'
          render={() => (
            <div>
              Login <Link to='/'>Go Home</Link>
            </div>
          )}
        />
        <Route
          path='/auth-callback'
          render={() => (
            <div>
              Auth Callback <Link to='/'>Go Home</Link>
            </div>
          )}
        />
      </Switch>
    </AuthProvider>
  </MemoryRouter>
);
