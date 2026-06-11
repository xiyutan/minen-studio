import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  apiKey: string;
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setApiKey: (key: string) => void;
  setTheme: (theme: Theme) => void;
  loadSettings: () => void;
  saveSettings: () => void;
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme;
}

function applyTheme(resolvedTheme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (resolvedTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  apiKey: '',
  theme: 'system',
  resolvedTheme: 'light',

  setApiKey: (key: string) => {
    set({ apiKey: key.trim() });
    get().saveSettings();
  },

  setTheme: (theme: Theme) => {
    const resolvedTheme = resolveTheme(theme);
    set({ theme, resolvedTheme });
    applyTheme(resolvedTheme);
    get().saveSettings();
  },

  loadSettings: () => {
    if (typeof window === 'undefined') return;
    const apiKey = localStorage.getItem('api_key') || '';
    const theme = (localStorage.getItem('theme') as Theme) || 'system';
    const resolvedTheme = resolveTheme(theme);
    set({ apiKey, theme, resolvedTheme });
    applyTheme(resolvedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentTheme = get().theme;
      if (currentTheme === 'system') {
        const newResolved = getSystemTheme();
        set({ resolvedTheme: newResolved });
        applyTheme(newResolved);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
  },

  saveSettings: () => {
    if (typeof window === 'undefined') return;
    const { apiKey, theme } = get();
    localStorage.setItem('api_key', apiKey);
    localStorage.setItem('theme', theme);
  },
}));
