import { ProviderChildren } from './ProviderChildren';
import { AuthProvider } from './AuthProvider';
import { RouterProvider } from './RouterProvider';
import { StateProvider } from './StateProvider';

export const Providers = ({ children }: ProviderChildren) => (
  <StateProvider>
    <AuthProvider>
      <RouterProvider>{children}</RouterProvider>
    </AuthProvider>
  </StateProvider>
);
