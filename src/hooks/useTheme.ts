import { useColorScheme } from 'react-native';
import { useAppStore } from '../store';
import { lightTheme, darkTheme, Theme } from '../theme';

export const useTheme = (): {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
} => {
  const systemColorScheme = useColorScheme();
  const themePreference = useAppStore((state) => state.settings.themePreference);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  const isDark =
    themePreference === 'dark' || (themePreference === 'system' && systemColorScheme === 'dark');

  return {
    theme: isDark ? darkTheme : lightTheme,
    isDark,
    toggleTheme,
  };
};
