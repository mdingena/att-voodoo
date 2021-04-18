import React from 'react';
import { User } from 'oidc-client';
import { AuthContextProps, AuthProviderProps, RequireAuthProps, LoginButtonProps } from './interfaces';

declare global {
  interface Window {
    altaApi: any;
  }
}

function loadScript(callback: () => void) {
  var style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'https://accounts.townshiptale.com/includes/altastyle.css';
  document.head.appendChild(style);

  var element = document.createElement('script');
  element.setAttribute('src', 'https://accounts.townshiptale.com/includes/altaapi.js');
  document.head.appendChild(element);
  element.onload = callback;
}

const AuthContext = React.createContext<AuthContextProps | null>(null);
export const AuthConsumer = AuthContext.Consumer;

export const AuthProvider: React.FC<AuthProviderProps> = ({
  config,
  children,
  configureManager = undefined,
  location = window.location,
  autoSignIn = false
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [userData, setUserData] = React.useState<User | null>(null);

  React.useEffect(() => {
    loadScript(() => {
      window.altaApi.signIn = () => window.altaApi.oidc.signinRedirect();
      window.altaApi.init(config, () => {
        configureManager && configureManager(window.altaApi.oidc);

        window.altaApi.oidc.events.addUserLoaded((user: any) => {
          console.log('User loaded');
          console.log({ user });
          setUserData(user);
        });
        window.altaApi.oidc.events.addUserUnloaded(() => {
          console.log('User unloaded');
          setUserData(null);
        });

        window.altaApi.checkSignInCallback(location);

        setLoaded(true);
      });
    });
  }, []);

  React.useEffect(() => {
    if (!!window.altaApi) {
      if (window.altaApi.checkSignInCallback(location)) {
        return;
      }

      const getUser = async () => {
        var user = await window.altaApi.getUser();

        if (!!user && !user.expired && !userData) {
          setUserData(user);
        } else if ((!user || user.expired) && autoSignIn) {
          console.log('SIGNIN');
          console.log({ user });

          window.altaApi
            .signIn()
            .then((result: any) => console.log({ result }))
            .catch((error: any) => console.error({ error }));
        }
      };

      getUser();
    }
  }, [location, !!window.altaApi]);

  return (
    <AuthContext.Provider value={!!window.altaApi ? { ...window.altaApi, userData } : undefined}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext<AuthContextProps | null>(AuthContext);

/**
 * A public higher-order component to access the imperative API
 */
export function withAuth<P extends AuthContextProps>(
  Component: React.ComponentType<P>
): React.ComponentType<Omit<P, keyof AuthContextProps>> {
  const displayName = `withAuth(${Component.displayName || Component.name})`;
  const C: React.FC<Omit<P, keyof AuthContextProps>> = props => {
    const auth = useAuth();

    return <Component {...(props as P)} {...auth} />;
  };

  C.displayName = displayName;

  return C;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ LoggingInComponent, children }) => {
  const auth = useAuth();

  React.useEffect(() => {
    if (!!auth?.oidc && !auth.userData) {
      auth
        ?.signIn()
        .then(result => console.log({ useEffectResult: result }))
        .catch(error => console.error({ useEffectError: error }));
    }
  }, [!!auth?.oidc, auth?.userData]);

  if (!auth?.userData) {
    if (!!LoggingInComponent) {
      const Component = LoggingInComponent as any;

      return <Component retry={() => auth?.signIn()} />;
    } else {
      return (
        <div>
          <h1>Showing login in popup.</h1>
          <button
            onClick={() =>
              auth
                ?.signIn()
                .then(result => console.log({ buttonClickResult: result }))
                .catch(error => console.error({ buttonClickError: error }))
            }
          >
            Click here if it doesn't appear.
          </button>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export const LoginButton: React.FC<LoginButtonProps> = ({ small = false, style, type = 'auto' }) => {
  var auth = useAuth();

  var isLogin = type === 'auto' ? !auth?.userData : type === 'login';

  var username = auth?.userData?.profile?.Username ?? auth?.userData?.profile?.sub;

  var onClick = () => {
    if (!auth?.oidc) {
      console.error("Can't login until alta login library is loaded.");
      return;
    }

    var login = isLogin ? auth.signIn : auth.signOut;

    login().then(console.log).catch(console.error);
  };

  var className = isLogin ? 'alta_loginWithAlta' : 'alta_loginWithAlta alta_loggedIn';

  return (
    <div className={className} style={style}>
      <button onClick={onClick}>
        <img alt='icon1' src='https://accounts.townshiptale.com/icon.svg' />
        <img alt='icon2' src='https://accounts.townshiptale.com/icon.svg' />
        <span className='alta_noHover'>{isLogin ? (small ? 'Login' : 'Login with Alta') : username}</span>
        <span className='alta_hover'>{isLogin ? (small ? 'Login' : 'Login with Alta') : 'Logout'}</span>
      </button>
    </div>
  );
};
