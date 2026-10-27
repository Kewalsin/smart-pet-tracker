import { lightTheme, Theme } from './lightTheme';
import { darkTheme } from './darkTheme';

export { lightTheme, darkTheme };
export type { Theme };

export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};
