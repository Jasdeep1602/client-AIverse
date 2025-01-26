/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { commonService } from '@/axios/services';
import axios from 'axios';

// Interface for chat-related payloads
export interface FetchChatInterface {
  data?: any;
  params?: any;
  chatId?: string;
}

// Interface for chat state
export interface ChatState {
  currentChatId: string | null;
  chatSessions: any[];
  currentChatMessages: any[];
  isChatSessionFetching: boolean;
  isSendingMessage: boolean;
  error: string | null;
}

// Initial state
const initialState: ChatState = {
  currentChatId: null,
  chatSessions: [],
  currentChatMessages: [],
  isChatSessionFetching: false,
  isSendingMessage: false,
  error: null,
};

// Async Thunks for Chat Operations
export const createChatSession = createAsyncThunk(
  'chat/createSession',
  async (payload: FetchChatInterface | undefined, thunkAPI) => {
    const source = axios.CancelToken.source();
    thunkAPI.signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const resp = await commonService({
        method: 'POST',
        url: 'chat/sessions',
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

export const fetchChatSessions = createAsyncThunk(
  'chat/fetchSessions',
  async (payload: FetchChatInterface | undefined, thunkAPI) => {
    const source = axios.CancelToken.source();
    thunkAPI.signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const resp = await commonService({
        method: 'GET',
        url: `chat/sessions/${payload?.data?.userId}`,
        params: payload?.params,
        cancelToken: source.token,
      });

      return resp?.data;
    } catch (error: any) {
      return thunkAPI?.rejectWithValue(error?.message);
    }
  }
);

export const fetchSingleChatSession = createAsyncThunk(
  'chat/fetchSingleSession',
  async (payload: FetchChatInterface | undefined, thunkAPI) => {
    const source = axios.CancelToken.source();
    thunkAPI.signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const resp = await commonService({
        method: 'GET',
        url: `chat/session/${payload?.chatId}`,
        params: payload?.params,
        cancelToken: source.token,
      });

      return resp?.data;
    } catch (error: any) {
      return thunkAPI?.rejectWithValue(error?.message);
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async (payload: FetchChatInterface | undefined, thunkAPI) => {
    const source = axios.CancelToken.source();
    thunkAPI.signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const resp = await commonService({
        method: 'POST',
        url: 'chat/message',
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

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async (payload: FetchChatInterface | undefined, thunkAPI) => {
    const source = axios.CancelToken.source();
    thunkAPI.signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const resp = await commonService({
        method: 'GET',
        url: `chat/history/${payload?.chatId}`,
        params: payload?.params,
        cancelToken: source.token,
      });

      return resp?.data;
    } catch (error: any) {
      return thunkAPI?.rejectWithValue(error?.message);
    }
  }
);

// Chat Slice
const ChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChatId(state, action) {
      state.currentChatId = action.payload;
    },
    clearCurrentChatMessages(state) {
      state.currentChatMessages = [];
    },
  },
  extraReducers: (builder) => {
    // Create Chat Session
    builder.addCase(createChatSession.pending, (state) => {
      state.isChatSessionFetching = true;
      state.error = null;
    });
    builder.addCase(createChatSession.fulfilled, (state, action) => {
      state.isChatSessionFetching = false;
      state.currentChatId = action.payload._id;
      state.chatSessions.push(action.payload);
    });
    builder.addCase(createChatSession.rejected, (state, action) => {
      state.isChatSessionFetching = false;
      state.error = action.payload as string;
    });

    // Fetch Chat Sessions
    builder.addCase(fetchChatSessions.pending, (state) => {
      state.isChatSessionFetching = true;
      state.error = null;
    });
    builder.addCase(fetchChatSessions.fulfilled, (state, action) => {
      state.isChatSessionFetching = false;
      state.chatSessions = action.payload;
    });
    builder.addCase(fetchChatSessions.rejected, (state, action) => {
      state.isChatSessionFetching = false;
      state.error = action.payload as string;
    });

    // Add to extraReducers in the existing slice
    builder.addCase(fetchSingleChatSession.pending, (state) => {
      state.isChatSessionFetching = true;
      state.error = null;
    });
    builder.addCase(fetchSingleChatSession.fulfilled, (state, action) => {
      state.isChatSessionFetching = false;
      // Update the current chat session details
      state.currentChatId = action.payload._id;
      // Optionally update messages if included in the response
      if (action.payload.messages) {
        state.currentChatMessages = action.payload.messages;
      }
    });
    builder.addCase(fetchSingleChatSession.rejected, (state, action) => {
      state.isChatSessionFetching = false;
      state.error = action.payload as string;
    });

    // Send Chat Message
    builder.addCase(sendChatMessage.pending, (state) => {
      state.isSendingMessage = true;
      state.error = null;
    });
    builder.addCase(sendChatMessage.fulfilled, (state, action) => {
      state.isSendingMessage = false;
      state.currentChatMessages.push(
        { role: 'user', content: action.payload.userMessage },
        { role: 'model', content: action.payload.response }
      );
    });
    builder.addCase(sendChatMessage.rejected, (state, action) => {
      state.isSendingMessage = false;
      state.error = action.payload as string;
    });

    // Fetch Chat History
    builder.addCase(fetchChatHistory.pending, (state) => {
      state.isChatSessionFetching = true;
      state.error = null;
    });
    builder.addCase(fetchChatHistory.fulfilled, (state, action) => {
      state.isChatSessionFetching = false;
      state.currentChatMessages = action.payload;
    });
    builder.addCase(fetchChatHistory.rejected, (state, action) => {
      state.isChatSessionFetching = false;
      state.error = action.payload as string;
    });
  },
});

export const { setCurrentChatId, clearCurrentChatMessages } = ChatSlice.actions;
export default ChatSlice.reducer;
