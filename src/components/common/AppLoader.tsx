import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from './AppText';

interface AppLoaderProps {
  message?: string;
  style?: ViewStyle;
}

export const AppLoader: React.FC<AppLoaderProps> = ({ message, style }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && (
        <AppText variant="bodyMedium" color="secondary" style={styles.message}>
          {message}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
  },
});
