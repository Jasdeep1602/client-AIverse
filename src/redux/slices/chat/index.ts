/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { commonService } from '@/axios/services';
import axios from 'axios';
import { ChatState, FetchChatInterface } from './interface';

// Interface for chat-related payloads

// Interface for chat state

// Initial state
const initialState = {
  currentChatId: null,
  chatSessions: [],
  currentChatMessages: [],
  isChatSessionFetching: false,
  isSendingMessage: false,
  error: null,
} as ChatState;

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

export const deleteChatSession = createAsyncThunk(
  'chat/deleteSession',
  async (payload: FetchChatInterface | undefined, thunkAPI) => {
    const source = axios.CancelToken.source();
    thunkAPI.signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const resp = await commonService({
        method: 'DELETE',
        url: `chat/session/${payload?.chatId}`,
        cancelToken: source.token,
      });
      return { chatId: payload?.chatId, ...resp?.data };
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

export const updateChatTitle = createAsyncThunk(
  'chat/updateTitle',
  async (payload: FetchChatInterface | undefined, thunkAPI) => {
    const source = axios.CancelToken.source();
    thunkAPI.signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const resp = await commonService({
        method: 'PUT',
        url: `chat/sessions/${payload?.chatId}/title`,
        cancelToken: source.token,
      });
      return { chatId: payload?.chatId, title: resp?.data?.title };
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
        { role: 'user', content: action.payload.user },
        { role: 'model', content: action.payload.response }
      );

      // Update the chat title in the sessions list
      if (action.payload.title) {
        const chatSession = state.chatSessions.find(
          (session) => session._id === state.currentChatId
        );
        if (chatSession) {
          chatSession.title = action.payload.title;
        }
      }
    });
    builder.addCase(sendChatMessage.rejected, (state, action) => {
      state.isSendingMessage = false;
      state.error = action.payload as string;
    });

    builder.addCase(deleteChatSession.pending, (state) => {
      state.isChatSessionFetching = true;
      state.error = null;
    });
    builder.addCase(deleteChatSession.fulfilled, (state, action) => {
      state.isChatSessionFetching = false;
      state.chatSessions = state.chatSessions.filter(
        (session) => session._id !== action.payload.chatId
      );
      if (state.currentChatId === action.payload.chatId) {
        state.currentChatId = state.chatSessions[0]?._id || null;
        state.currentChatMessages = [];
      }
    });
    builder.addCase(deleteChatSession.rejected, (state, action) => {
      state.isChatSessionFetching = false;
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

    builder.addCase(updateChatTitle.pending, (state) => {
      // Optionally add loading state if needed
      state.error = null;
    });
    builder.addCase(updateChatTitle.fulfilled, (state, action) => {
      const chatSession = state.chatSessions.find(
        (session) => session._id === action.payload.chatId
      );
      if (chatSession) {
        chatSession.title = action.payload.title;
      }
    });
    builder.addCase(updateChatTitle.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { setCurrentChatId, clearCurrentChatMessages } = ChatSlice.actions;
export default ChatSlice.reducer;
