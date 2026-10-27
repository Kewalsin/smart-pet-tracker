import React from 'react';
import {
  ScrollView,
  ScrollViewProps,
  RefreshControl,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface AppScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentContainerStyle?: ViewStyle;
}

export const AppScrollView: React.FC<AppScrollViewProps> = ({
  children,
  refreshing = false,
  onRefresh,
  contentContainerStyle,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        ) : undefined
      }
      {...props}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
