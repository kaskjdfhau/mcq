import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'custom';

export interface CustomTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });

  const [customTheme, setCustomTheme] = useState<CustomTheme>(() => {
    const saved = localStorage.getItem('customTheme');
    return saved ? JSON.parse(saved) : {
      primary: '#4F46E5',
      secondary: '#6B7280',
      background: '#F3F4F6',
      text: '#1F2937',
      accent: '#818CF8'
    };
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark', 'custom');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (theme === 'custom') {
      localStorage.setItem('customTheme', JSON.stringify(customTheme));
      const root = document.documentElement;
      root.style.setProperty('--color-primary', customTheme.primary);
      root.style.setProperty('--color-secondary', customTheme.secondary);
      root.style.setProperty('--color-background', customTheme.background);
      root.style.setProperty('--color-text', customTheme.text);
      root.style.setProperty('--color-accent', customTheme.accent);
    }
  }, [theme, customTheme]);

  return {
    theme,
    setTheme,
    customTheme,
    setCustomTheme
  };
}