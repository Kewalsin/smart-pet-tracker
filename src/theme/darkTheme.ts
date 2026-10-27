import { palette } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { borderRadius } from './borderRadius';
import { shadows } from './shadows';
import { Theme } from './lightTheme';

export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: palette.forest400,
    primaryLight: palette.forest300,
    primaryUltraLight: '#16281E',
    primaryDark: palette.forest600,

    background: palette.darkBg,
    surface: palette.darkSurface,
    card: palette.darkCard,
    cardAlt: '#27342C',

    textPrimary: palette.darkTextPrimary,
    textSecondary: palette.darkTextSecondary,
    textMuted: '#6B7A72',
    textInverse: palette.neutral900,

    border: palette.darkBorder,
    borderLight: '#1F2923',
    divider: palette.darkBorder,

    success: palette.forest400,
    successBg: '#152C21',
    warning: palette.amber500,
    warningBg: '#2E2310',
    error: palette.red500,
    errorBg: '#2E1515',
    info: palette.blue500,
    infoBg: '#102235',

    trackerActive: palette.forest400,
    trackerInactive: '#5B6862',
    batteryHigh: palette.forest400,
    batteryMedium: palette.amber500,
    batteryLow: palette.red500,

    tabBarBackground: palette.darkSurface,
    tabBarActive: palette.forest400,
    tabBarInactive: '#6B7A72',
  },
  spacing,
  typography,
  borderRadius,
  shadows: {
    none: shadows.none,
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};
