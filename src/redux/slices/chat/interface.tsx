/* eslint-disable @typescript-eslint/no-explicit-any */
export declare interface ChatState {
  currentChatId: string | null;
  chatSessions: any[];
  currentChatMessages: any[];
  isChatSessionFetching: boolean;
  isSendingMessage: boolean;
  error: string | null;
}

export declare interface FetchChatInterface {
  data?: { [key: string]: string | number | object | null | boolean };
  params?: { [key: string]: string | number | object | null };
  chatId?: string | null;
}
