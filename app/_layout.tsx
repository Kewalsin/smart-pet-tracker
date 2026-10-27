import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAppStore } from '../src/store';
import { useTheme } from '../src/hooks/useTheme';
import { AppLoader } from '../src/components/common/AppLoader';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  const isInitialized = useAppStore((state) => state.isInitialized);
  const initializeStore = useAppStore((state) => state.initializeStore);
  const { theme } = useTheme();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  if (!isInitialized) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <AppLoader message="Loading PetPulse..." />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="pets/index" />
      <Stack.Screen name="pets/add" />
      <Stack.Screen name="pets/[id]" />
      <Stack.Screen name="tracking" />
      <Stack.Screen name="activity" />
      <Stack.Screen name="health" />
      <Stack.Screen name="reminders/index" />
      <Stack.Screen name="reminders/add" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
