import { AuthProvider as Provider } from '@/components/AltaAuth';
import { ProviderChildren } from './ProviderChildren';

const config = {
  client_id: process.env.ALTA_CLIENT_ID,
  scope: 'openid',
  redirect_uri: 'att-voodoo://auth-callback'
};

export const AuthProvider = ({ children }: ProviderChildren) => <Provider config={config}>{children}</Provider>;
