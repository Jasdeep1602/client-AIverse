import { combineReducers } from '@reduxjs/toolkit';
import AuthSlice from './auth';
import ChatSlice from './chat';

// combine reducer
const rootReducer = combineReducers({
  auth: AuthSlice,
  chat: ChatSlice,
});

export default rootReducer;
