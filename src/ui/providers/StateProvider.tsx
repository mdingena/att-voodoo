import { Provider } from 'jotai';
import { ProviderChildren } from './ProviderChildren';

export const StateProvider = ({ children }: ProviderChildren) => <Provider>{children}</Provider>;
