/* eslint-disable @typescript-eslint/no-explicit-any */
import { commonService } from '@/axios/services';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { FetchAuthInterface, AuthState } from './interface';
import Cookies from 'js-cookie';

const initialState = {
  token: null,
  isLogged: false,
  isLoginFetching: false,
  isRegFetching: false,
  isLogoutFetching: false,
} as AuthState;

export const authLogin = createAsyncThunk(
  'login',
  async (payload: FetchAuthInterface | undefined, thunkAPI) => {
    const source = axios.CancelToken.source();
    thunkAPI.signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const resp = await commonService({
        method: 'POST',
        url: 'user/login',
        data: payload?.data,
        params: payload?.params,
        cancelToken: source.token,
      });

      return resp?.data;
    } catch (error: any) {
      return thunkAPI?.rejectWithValue(error?.message);
    }
  }
);
export const authRegister = createAsyncThunk(
  'register',
  async (payload: FetchAuthInterface | undefined, thunkAPI) => {
    const source = axios.CancelToken.source();
    thunkAPI.signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const resp = await commonService({
        method: 'POST',
        url: 'user/register',
        data: payload?.data,
        params: payload?.params,
        cancelToken: source.token,
      });

      return resp?.data;
    } catch (error: any) {
      return thunkAPI?.rejectWithValue(error?.message);
    }
  }
);

export const authLogout = createAsyncThunk(
  'logout',
  async (payload: FetchAuthInterface | undefined, thunkAPI) => {
    const source = axios.CancelToken.source();
    thunkAPI.signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const resp = await commonService({
        method: 'GET',
        url: 'user/logout',
        data: payload?.data,
        params: payload?.params,
        cancelToken: source.token,
      });

      return resp?.data;
    } catch (error: any) {
      return thunkAPI?.rejectWithValue(error?.message);
    }
  }
);

// export const getUser = createAsyncThunk(
//   'getUser',
//   async (payload: FetchAuthInterface | undefined, thunkAPI) => {
//     const source = axios.CancelToken.source();
//     thunkAPI.signal.addEventListener('abort', () => {
//       source.cancel();
//     });
//     try {
//       const resp = await commonService({
//         method: 'GET',
//         url: 'user/',
//         data: payload?.data,
//         params: payload?.params,
//         cancelToken: source.token,
//       });

//       console.log(resp, 'asynctoken');
//       return resp?.data;
//     } catch (error: any) {
//       return thunkAPI?.rejectWithValue(error?.message);
//     }
//   }
// );

// export const getUser = createAsyncThunk('getUser', async (token: string | null, thunkAPI) => {
//   try {
//     const resp = await commonService({
//       method: 'GET',
//       url: 'user/infor',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return resp.data;
//   } catch (error: any) {
//     return thunkAPI.rejectWithValue(error.message);
//   }
// });

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(init, action) {
      const state = init;
      state.token = action.payload;
    },
    setIsLogged(init, action) {
      const state = init;
      state.isLogged = action.payload;
    },
  },

  // middleware extended reducers
  extraReducers: (builder) => {
    // - - - - Adding Login  - - - - - - - -
    builder.addCase(authLogin.pending, (init) => {
      const state = init;
      // state.data = null;
      state.isLoginFetching = true;
    });
    builder.addCase(authLogin.fulfilled, (init, action) => {
      const state = init;
      Cookies.set('accesstoken', action.payload.accesstoken, {
        expires: 7,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      localStorage.setItem('accesstoken', action.payload.accesstoken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      state.isLogged = true;
      state.isLoginFetching = false;
    });
    builder.addCase(authLogin.rejected, (init) => {
      const state = init;
      state.isLoginFetching = false;
    });

    // - - - - Adding Register  - - - - - - - -

    builder.addCase(authRegister.pending, (init) => {
      const state = init;
      // state.data = null;
      state.isRegFetching = true;
    });
    builder.addCase(authRegister.fulfilled, (init) => {
      const state = init;

      state.isRegFetching = false;
    });
    builder.addCase(authRegister.rejected, (init) => {
      const state = init;
      state.isRegFetching = false;
    });

    // - - - - Adding Logout  - - - - - - - -
    builder.addCase(authLogout.pending, (init) => {
      const state = init;
      // state.data = null;
      state.isLogoutFetching = true;
    });
    builder.addCase(authLogout.fulfilled, (init) => {
      const state = init;
      Cookies.remove('accesstoken', { path: '/' });

      // Clear localStorage
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('user');
      state.isLogoutFetching = false;
    });
    builder.addCase(authLogout.rejected, (init) => {
      const state = init;
      state.isLogoutFetching = false;
    });
  },
});

export const { setIsLogged } = AuthSlice.actions;
export default AuthSlice.reducer;
