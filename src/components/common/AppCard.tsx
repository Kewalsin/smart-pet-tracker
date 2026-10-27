import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  onPress,
  style,
  padding = 'md',
  shadow = 'sm',
  bordered = true,
}) => {
  const { theme } = useTheme();

  const getPaddingValue = (): number => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return theme.spacing.sm;
      case 'lg':
        return theme.spacing.lg;
      case 'md':
      default:
        return theme.spacing.base;
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: getPaddingValue(),
    borderColor: bordered ? theme.colors.border : 'transparent',
    borderWidth: bordered ? 1 : 0,
    ...theme.shadows[shadow],
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[styles.container, cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.container, cardStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
