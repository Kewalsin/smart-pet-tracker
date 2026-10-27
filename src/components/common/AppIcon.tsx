import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export type IconName = keyof typeof Ionicons.glyphMap;

interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: any;
}

export const AppIcon: React.FC<AppIconProps> = ({ name, size = 22, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.textPrimary;

  return <Ionicons name={name} size={size} color={iconColor} style={style} />;
};
