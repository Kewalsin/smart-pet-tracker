import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from './AppText';
import { AppIcon, IconName } from './AppIcon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    let bg = theme.colors.primary;
    let border = 'transparent';
    let borderWidth = 0;

    switch (variant) {
      case 'secondary':
        bg = theme.colors.primaryUltraLight;
        break;
      case 'outline':
        bg = 'transparent';
        border = theme.colors.primary;
        borderWidth = 1.5;
        break;
      case 'ghost':
        bg = 'transparent';
        break;
      case 'danger':
        bg = theme.colors.error;
        break;
      case 'primary':
      default:
        bg = theme.colors.primary;
        break;
    }

    let paddingVertical: number = theme.spacing.md;
    let paddingHorizontal: number = theme.spacing.lg;
    let borderRadius: number = theme.borderRadius.lg;

    if (size === 'sm') {
      paddingVertical = theme.spacing.sm;
      paddingHorizontal = theme.spacing.md;
      borderRadius = theme.borderRadius.md;
    } else if (size === 'lg') {
      paddingVertical = theme.spacing.base;
      paddingHorizontal = theme.spacing.xl;
      borderRadius = theme.borderRadius.xl;
    }

    return {
      backgroundColor: bg,
      borderColor: border,
      borderWidth,
      paddingVertical,
      paddingHorizontal,
      borderRadius,
      opacity: disabled || loading ? 0.6 : 1,
    };
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'secondary':
        return theme.colors.primary;
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      case 'danger':
      case 'primary':
      default:
        return '#FFFFFF';
    }
  };

  const iconColor = getTextColor();
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.base, getContainerStyle(), style]}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon && (
            <AppIcon
              name={leftIcon}
              size={iconSize}
              color={iconColor}
              style={{ marginRight: theme.spacing.sm }}
            />
          )}
          <AppText
            variant={size === 'sm' ? 'captionBold' : size === 'lg' ? 'title' : 'bodyBold'}
            customColor={getTextColor()}
            style={textStyle}
          >
            {title}
          </AppText>
          {rightIcon && (
            <AppIcon
              name={rightIcon}
              size={iconSize}
              color={iconColor}
              style={{ marginLeft: theme.spacing.sm }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
