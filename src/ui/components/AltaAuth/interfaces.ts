import { UserManager, User, UserManagerSettings } from 'oidc-client';

export interface Location {
  search: string;
  hash: string;
  href: string;
}

export interface RequireAuthProps {
  LoggingInComponent?: React.Component;
}

export interface AuthProviderProps {
  /**
   * See [UserManager](https://github.com/IdentityModel/oidc-client-js/wiki#usermanager) for more details.
   */
  configureManager?: (manager: UserManager) => void;

  config: UserManagerSettings;

  /**
   * Defaults to `windows.location`.
   */
  location?: Location;

  /**
   * defaults to true
   */
  autoSignIn?: boolean;
}

export interface AuthContextProps {
  /**
   * Alias for userManager.signInRedirect
   */
  signIn: (args?: unknown) => Promise<void>;
  /**
   * Alias for removeUser
   */
  signOut: () => Promise<void>;
  /**
   * See [UserManager](https://github.com/IdentityModel/oidc-client-js/wiki#usermanager) for more details.
   */
  oidc: UserManager | null;
  /**
   * See [User](https://github.com/IdentityModel/oidc-client-js/wiki#user) for more details.
   */
  userData?: User | null;

  fetch: (method: String, url: String, body?: any) => Promise<any>;

  fetchRaw: (method: String, url: String, body?: any) => Promise<any>;
}

export interface LoginButtonProps {
  small?: Boolean;
  style?: React.CSSProperties;
  type?: 'auto' | 'login' | 'logout';
}
