import React from 'react';
import { Text, TextStyle, TextProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyMedium'
  | 'bodyBold'
  | 'caption'
  | 'captionBold'
  | 'badge';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'inverse'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: TextColor;
  customColor?: string;
  align?: TextStyle['textAlign'];
  style?: any;
  children: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = 'primary',
  customColor,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: theme.typography.fontSize.xxxl,
          fontWeight: theme.typography.fontWeight.heavy,
          lineHeight: theme.typography.fontSize.xxxl * theme.typography.lineHeight.tight,
        };
      case 'h2':
        return {
          fontSize: theme.typography.fontSize.xxl,
          fontWeight: theme.typography.fontWeight.bold,
          lineHeight: theme.typography.fontSize.xxl * theme.typography.lineHeight.tight,
        };
      case 'h3':
        return {
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.bold,
          lineHeight: theme.typography.fontSize.xl * theme.typography.lineHeight.tight,
        };
      case 'title':
        return {
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.semibold,
          lineHeight: theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
        };
      case 'subtitle':
        return {
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.medium,
          lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
        };
      case 'bodyMedium':
        return {
          fontSize: theme.typography.fontSize.base,
          fontWeight: theme.typography.fontWeight.medium,
          lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
        };
      case 'bodyBold':
        return {
          fontSize: theme.typography.fontSize.base,
          fontWeight: theme.typography.fontWeight.bold,
          lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
        };
      case 'caption':
        return {
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.regular,
          lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
        };
      case 'captionBold':
        return {
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.bold,
          lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
        };
      case 'badge':
        return {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.semibold,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        };
      case 'body':
      default:
        return {
          fontSize: theme.typography.fontSize.base,
          fontWeight: theme.typography.fontWeight.regular,
          lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
        };
    }
  };

  const getColorStyle = (): string => {
    if (customColor) return customColor;
    switch (color) {
      case 'secondary':
        return theme.colors.textSecondary;
      case 'muted':
        return theme.colors.textMuted;
      case 'inverse':
        return theme.colors.textInverse;
      case 'brand':
        return theme.colors.primary;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'primary':
      default:
        return theme.colors.textPrimary;
    }
  };

  return (
    <Text
      style={[
        getVariantStyle(),
        {
          color: getColorStyle(),
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
