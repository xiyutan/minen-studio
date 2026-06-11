import { create } from 'zustand';

interface SettingsState {
  apiKey: string;
  theme: 'light' | 'dark';
  setApiKey: (key: string) => void;
  toggleTheme: () => void;
  loadSettings: () => void;
  saveSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  apiKey: '',
  theme: 'light',

  setApiKey: (key: string) => {
    set({ apiKey: key });
    get().saveSettings();
  },

  toggleTheme: () => {
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
    get().saveSettings();
  },

  loadSettings: () => {
    if (typeof window !== 'undefined') {
      const apiKey = localStorage.getItem('api_key') || '';
      const theme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
      set({ apiKey, theme });
    }
  },

  saveSettings: () => {
    if (typeof window !== 'undefined') {
      const { apiKey, theme } = get();
      localStorage.setItem('api_key', apiKey);
      localStorage.setItem('theme', theme);
    }
  },
}));
