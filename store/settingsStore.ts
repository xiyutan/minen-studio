import { create } from 'zustand';

interface SettingsState {
  apiKey: string;
  theme: 'light' | 'dark';
  setApiKey: (key: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  loadSettings: () => void;
  saveSettings: () => void;
}

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  apiKey: '',
  theme: 'light',

  setApiKey: (key: string) => {
    set({ apiKey: key.trim() });
    get().saveSettings();
  },

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
    applyTheme(theme);
    get().saveSettings();
  },

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: next });
    applyTheme(next);
    get().saveSettings();
  },

  loadSettings: () => {
    if (typeof window === 'undefined') return;
    const apiKey = localStorage.getItem('api_key') || '';
    const theme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    set({ apiKey, theme });
    applyTheme(theme);
  },

  saveSettings: () => {
    if (typeof window === 'undefined') return;
    const { apiKey, theme } = get();
    localStorage.setItem('api_key', apiKey);
    localStorage.setItem('theme', theme);
  },
}));
