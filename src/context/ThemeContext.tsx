import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import {useColorScheme} from 'react-native';
import {AppTheme, ThemeColors} from '../types';
import {lightColors, darkColors} from '../theme';
import {getThemePreference, saveThemePreference} from '../storage/storageService';

interface ThemeContextType {
  theme: AppTheme;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<AppTheme>(
    systemColorScheme === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await getThemePreference();
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    };
    loadTheme();
  }, []);

  const colors = theme === 'dark' ? darkColors : lightColors;

  const toggleTheme = useCallback(() => {
    const newTheme: AppTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    saveThemePreference(newTheme);
  }, [theme]);

  const setTheme = useCallback((newTheme: AppTheme) => {
    setThemeState(newTheme);
    saveThemePreference(newTheme);
  }, []);

  const value: ThemeContextType = {
    theme,
    colors,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

