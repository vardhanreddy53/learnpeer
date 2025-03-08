import { create } from 'zustand';
import { Message } from '../types';
import { io, Socket } from 'socket.io-client';

interface ChatState {
  messages: Record<string, Message[]>; // courseId -> messages
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  socket: Socket | null;
  connectToChat: (userId: string, userName: string) => void;
  disconnectFromChat: () => void;
  fetchMessages: (courseId: string) => Promise<void>;
  sendMessage: (courseId: string, content: string) => void;
  clearError: () => void;
}

// Mock data
const mockMessages: Record<string, Message[]> = {
  'course1': [
    {
      id: 'msg1',
      senderId: '3',
      senderName: 'Jane Smith',
      content: 'Welcome to Introduction to Calculus! Feel free to ask any questions.',
      timestamp: '2023-06-10T09:00:00Z',
      courseId: 'course1'
    },
    {
      id: 'msg2',
      senderId: '5',
      senderName: 'Alex Johnson',
      content: 'When will we cover integration techniques?',
      timestamp: '2023-06-10T09:05:00Z',
      courseId: 'course1'
    },
    {
      id: 'msg3',
      senderId: '3',
      senderName: 'Jane Smith',
      content: 'We\'ll cover integration techniques in our third session. Make sure to review the basics of derivatives before then.',
      timestamp: '2023-06-10T09:07:00Z',
      courseId: 'course1'
    }
  ],
  'course2': [
    {
      id: 'msg4',
      senderId: '4',
      senderName: 'Robert Johnson',
      content: 'Hello everyone! Looking forward to our first Advanced Physics class.',
      timestamp: '2023-06-11T14:00:00Z',
      courseId: 'course2'
    }
  ]
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  isConnected: false,
  isLoading: false,
  error: null,
  socket: null,
  
  connectToChat: (userId, userName) => {
    try {
      // In a real app, this would connect to your actual socket.io server
      // For this demo, we'll mock the socket connection
      const mockSocket = {
        on: (event: string, callback: Function) => {
          // Mock socket event listeners
          if (event === 'connect') {
            callback();
          }
          return mockSocket;
        },
        emit: (event: string, data: any) => {
          // Mock socket emit
          return mockSocket;
        },
        disconnect: () => {
          // Mock socket disconnect
          set({ isConnected: false, socket: null });
        }
      } as unknown as Socket;
      
      set({ socket: mockSocket, isConnected: true });
      
      // Mock successful connection
      setTimeout(() => {
        if (get().socket) {
          set({ isConnected: true });
        }
      }, 500);
    } catch (error) {
      set({ error: 'Failed to connect to chat', isConnected: false });
    }
  },
  
  disconnectFromChat: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({ isConnected: false, socket: null });
  },
  
  fetchMessages: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const courseMessages = mockMessages[courseId] || [];
      set(state => ({
        messages: {
          ...state.messages,
          [courseId]: courseMessages
        },
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to fetch messages', isLoading: false });
    }
  },
  
  sendMessage: (courseId, content) => {
    const { socket } = get();
    if (!socket || !get().isConnected) {
      set({ error: 'Not connected to chat' });
      return;
    }
    
    try {
      // In a real app, this would emit a message to the socket server
      // For this demo, we'll just add the message to our local state
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        senderId: '1', // Assuming current user
        senderName: 'Test User',
        content,
        timestamp: new Date().toISOString(),
        courseId
      };
      
      set(state => {
        const courseMessages = state.messages[courseId] || [];
        return {
          messages: {
            ...state.messages,
            [courseId]: [...courseMessages, newMessage]
          }
        };
      });
      
      // Mock socket emit
      socket.emit('message', { courseId, message: newMessage });
    } catch (error) {
      set({ error: 'Failed to send message' });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));