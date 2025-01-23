import { combineReducers } from '@reduxjs/toolkit';
import AuthSlice from './auth';

// combine reducer
const rootReducer = combineReducers({
  auth: AuthSlice,
});

export default rootReducer;
