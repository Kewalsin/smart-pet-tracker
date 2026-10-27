import { palette } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { borderRadius } from './borderRadius';
import { shadows } from './shadows';

export const lightTheme = {
  dark: false,
  colors: {
    primary: palette.forest700,
    primaryLight: palette.forest500,
    primaryUltraLight: palette.forest50,
    primaryDark: palette.forest900,

    background: palette.warmOffWhite,
    surface: palette.white,
    card: palette.white,
    cardAlt: palette.neutral50,

    textPrimary: palette.neutral900,
    textSecondary: palette.neutral600,
    textMuted: palette.neutral400,
    textInverse: palette.white,

    border: palette.neutral200,
    borderLight: palette.neutral100,
    divider: palette.neutral200,

    success: palette.forest500,
    successBg: palette.forest50,
    warning: palette.amber500,
    warningBg: palette.amber100,
    error: palette.red500,
    errorBg: palette.red100,
    info: palette.blue500,
    infoBg: palette.blue100,

    trackerActive: palette.forest500,
    trackerInactive: palette.neutral400,
    batteryHigh: palette.forest500,
    batteryMedium: palette.amber500,
    batteryLow: palette.red500,

    tabBarBackground: palette.white,
    tabBarActive: palette.forest700,
    tabBarInactive: palette.neutral400,
  },
  spacing,
  typography,
  borderRadius,
  shadows,
};

export type Theme = typeof lightTheme;
