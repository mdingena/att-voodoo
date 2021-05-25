import { HashRouter } from 'react-router-dom';
import { ProviderChildren } from './ProviderChildren';

export const RouterProvider = ({ children }: ProviderChildren) => <HashRouter>{children}</HashRouter>;
