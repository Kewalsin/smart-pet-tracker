import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from './AppText';
import { AppIcon, IconName } from './AppIcon';
import { AppButton } from './AppButton';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description: string;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'paw-outline',
  title,
  description,
  actionTitle,
  onActionPress,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: theme.colors.primaryUltraLight,
          },
        ]}
      >
        <AppIcon name={icon} size={42} color={theme.colors.primary} />
      </View>

      <AppText variant="title" align="center" style={styles.title}>
        {title}
      </AppText>

      <AppText variant="body" color="secondary" align="center" style={styles.description}>
        {description}
      </AppText>

      {actionTitle && onActionPress && (
        <AppButton
          title={actionTitle}
          onPress={onActionPress}
          variant="primary"
          size="md"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    maxWidth: 280,
    marginBottom: 20,
  },
  actionButton: {
    minWidth: 160,
  },
});
