'use client';

import { Provider } from 'react-redux';
import { store } from '../store';
import { AuthInitializer } from './AuthInitializer';

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
