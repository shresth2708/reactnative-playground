import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface Theme {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    hover: string;
    text: string;
    textSecondary: string;
  };
}

const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark',
  mode: 'dark',
  colors: {
    background: '#111827',
    foreground: '#1F2937',
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#8B5CF6',
    border: '#374151',
    hover: '#4B5563',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
  },
};

const lightTheme: Theme = {
  id: 'light',
  name: 'Light',
  mode: 'light',
  colors: {
    background: '#FFFFFF',
    foreground: '#F3F4F6',
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#8B5CF6',
    border: '#E5E7EB',
    hover: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
  },
};

interface ThemeState {
  mode: ThemeMode;
  currentTheme: Theme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  applyTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      currentTheme: darkTheme,

      setMode: (mode) => {
        let theme = darkTheme;
        
        if (mode === 'auto') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          theme = prefersDark ? darkTheme : lightTheme;
        } else {
          theme = mode === 'dark' ? darkTheme : lightTheme;
        }

        set({ mode, currentTheme: theme });
        applyThemeToDOM(theme);
      },

      toggleTheme: () => {
        const currentMode = get().mode;
        const newMode = currentMode === 'dark' ? 'light' : 'dark';
        get().setMode(newMode);
      },

      applyTheme: (theme) => {
        set({ currentTheme: theme });
        applyThemeToDOM(theme);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  root.setAttribute('data-theme', theme.mode);
}

// Initialize theme on load
if (typeof window !== 'undefined') {
  const store = useThemeStore.getState();
  applyThemeToDOM(store.currentTheme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (store.mode === 'auto') {
      const theme = e.matches ? darkTheme : lightTheme;
      store.applyTheme(theme);
    }
  });
}
