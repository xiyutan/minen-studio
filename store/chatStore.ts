import { create } from 'zustand';
import { Conversation, Message } from '@/types/chat';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  streamingMessage: string;
  isStreaming: boolean;

  createConversation: () => string;
  setCurrentConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateStreamingMessage: (content: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  finalizeStreamingMessage: (conversationId: string) => void;
  loadConversations: () => void;
  saveConversations: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  streamingMessage: '',
  isStreaming: false,

  createConversation: () => {
    const id = `conv_${Date.now()}`;
    const newConversation: Conversation = {
      id,
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      currentConversationId: id,
    }));
    get().saveConversations();
    return id;
  },

  setCurrentConversation: (id: string) => {
    set({ currentConversationId: id });
  },

  addMessage: (conversationId: string, message) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      ...message,
      timestamp: Date.now(),
    };

    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              updatedAt: Date.now(),
              title: conv.messages.length === 0 && message.role === 'user'
                ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
                : conv.title,
            }
          : conv
      ),
    }));
    get().saveConversations();
  },

  updateStreamingMessage: (content: string) => {
    set({ streamingMessage: content });
  },

  setIsStreaming: (isStreaming: boolean) => {
    set({ isStreaming });
  },

  finalizeStreamingMessage: (conversationId: string) => {
    const { streamingMessage } = get();
    if (streamingMessage) {
      get().addMessage(conversationId, {
        role: 'assistant',
        content: streamingMessage,
      });
      set({ streamingMessage: '', isStreaming: false });
    }
  },

  loadConversations: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat_history');
      if (saved) {
        const conversations = JSON.parse(saved);
        set({ conversations });
      }
    }
  },

  saveConversations: () => {
    if (typeof window !== 'undefined') {
      const { conversations } = get();
      localStorage.setItem('chat_history', JSON.stringify(conversations));
    }
  },
}));
