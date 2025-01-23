'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Provider } from 'react-redux';

import reduxStore from './store';

export default function ReduxProvider({ children }: any) {
  return <Provider store={reduxStore}>{children}</Provider>;
}
