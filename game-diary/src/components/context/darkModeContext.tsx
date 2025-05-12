import { createContext, useContext, useLayoutEffect, useState } from 'react';
import ContextWrapperProps from './contextWrapperProps';
type DarkModeContextType = {
  isDarkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};
const DarkModeContext = createContext<DarkModeContextType | null>(null);
export const DarkMeadContextProvider = ({ children }: ContextWrapperProps) => {
  const [isDarkMode, setDarkMode] = useState(true);
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
    }
  }, []);

  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  useLayoutEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  const darkModeObj: DarkModeContextType = {
    isDarkMode: isDarkMode,
    setDarkMode: setDarkMode,
  };
  return (
    <DarkModeContext.Provider value={darkModeObj}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkModeContext = () => {
  const context = useContext(DarkModeContext);
  if (context === null) {
    throw new Error(
      'useDarkModeContext must be used within a DarkMeadContextProvider'
    );
  }
  return context;
};
