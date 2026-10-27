import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useAppStore } from '../../store';
import { useTheme } from '../../hooks/useTheme';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppScrollView } from '../../components/layout/AppScrollView';
import { AppHeader } from '../../components/common/AppHeader';
import { AppCard } from '../../components/common/AppCard';
import { AppText } from '../../components/common/AppText';
import { AppButton } from '../../components/common/AppButton';
import { AppIcon, IconName } from '../../components/common/AppIcon';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { APP_CONFIG } from '../../config/appConfig';

export const SettingsScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const resetToDemoData = useAppStore((state) => state.resetToDemoData);

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleUnitToggle = async (type: 'distance' | 'weight') => {
    if (type === 'distance') {
      const nextUnit = settings.distanceUnit === 'km' ? 'mi' : 'km';
      await updateSettings({ distanceUnit: nextUnit });
    } else {
      const nextUnit = settings.weightUnit === 'kg' ? 'lbs' : 'kg';
      await updateSettings({ weightUnit: nextUnit });
    }
  };

  const handleNotificationToggle = async (val: boolean) => {
    await updateSettings({ notificationsEnabled: val });
  };

  const handleConfirmReset = async () => {
    setResetting(true);
    await resetToDemoData();
    setResetting(false);
    setResetDialogOpen(false);
  };

  return (
    <ScreenContainer>
      <AppHeader title="Settings" showBackButton style={styles.header} />

      <AppScrollView contentContainerStyle={styles.content}>
        {/* Appearance Section */}
        <AppText variant="captionBold" color="secondary" style={styles.sectionTitle}>
          APPEARANCE & THEME
        </AppText>

        <AppCard style={styles.card} padding="md">
          <View style={styles.row}>
            <View style={styles.iconCol}>
              <AppIcon
                name={isDark ? 'moon-outline' : 'sunny-outline'}
                size={22}
                color={theme.colors.primary}
              />
              <View style={styles.labelCol}>
                <AppText variant="bodyBold">Dark Theme</AppText>
                <AppText variant="caption" color="secondary">
                  {isDark ? 'Forest Night active' : 'Warm Meadow daylight active'}
                </AppText>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor="#FFFFFF"
              trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
            />
          </View>
        </AppCard>

        {/* Units Section */}
        <AppText variant="captionBold" color="secondary" style={styles.sectionTitle}>
          MEASUREMENT UNITS
        </AppText>

        <AppCard style={styles.card} padding="md">
          {/* Distance Unit */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => handleUnitToggle('distance')}
          >
            <View style={styles.iconCol}>
              <AppIcon name="map-outline" size={22} color={theme.colors.primary} />
              <View style={styles.labelCol}>
                <AppText variant="bodyBold">Distance Unit</AppText>
                <AppText variant="caption" color="secondary">
                  Currently in {settings.distanceUnit === 'km' ? 'Kilometers (km)' : 'Miles (mi)'}
                </AppText>
              </View>
            </View>
            <View
              style={[
                styles.unitBadge,
                { backgroundColor: theme.colors.primaryUltraLight },
              ]}
            >
              <AppText variant="captionBold" color="brand">
                {settings.distanceUnit.toUpperCase()}
              </AppText>
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Weight Unit */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => handleUnitToggle('weight')}
          >
            <View style={styles.iconCol}>
              <AppIcon name="scale-outline" size={22} color={theme.colors.primary} />
              <View style={styles.labelCol}>
                <AppText variant="bodyBold">Weight Unit</AppText>
                <AppText variant="caption" color="secondary">
                  Currently in {settings.weightUnit === 'kg' ? 'Kilograms (kg)' : 'Pounds (lbs)'}
                </AppText>
              </View>
            </View>
            <View
              style={[
                styles.unitBadge,
                { backgroundColor: theme.colors.primaryUltraLight },
              ]}
            >
              <AppText variant="captionBold" color="brand">
                {settings.weightUnit.toUpperCase()}
              </AppText>
            </View>
          </TouchableOpacity>
        </AppCard>

        {/* Notifications Section */}
        <AppText variant="captionBold" color="secondary" style={styles.sectionTitle}>
          NOTIFICATIONS
        </AppText>

        <AppCard style={styles.card} padding="md">
          <View style={styles.row}>
            <View style={styles.iconCol}>
              <AppIcon name="notifications-outline" size={22} color={theme.colors.primary} />
              <View style={styles.labelCol}>
                <AppText variant="bodyBold">Walk & Med Reminders</AppText>
                <AppText variant="caption" color="secondary">
                  Local device push reminders
                </AppText>
              </View>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={handleNotificationToggle}
              thumbColor="#FFFFFF"
              trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
            />
          </View>
        </AppCard>

        {/* Portfolio Demo Notice */}
        <AppText variant="captionBold" color="secondary" style={styles.sectionTitle}>
          DISCLOSURE & DEMO DATA
        </AppText>

        <AppCard style={styles.card} padding="md">
          <View style={styles.disclosureContent}>
            <AppIcon name="shield-checkmark-outline" size={24} color={theme.colors.primary} />
            <AppText variant="bodyBold" style={{ marginTop: 8 }}>
              Local Offline Portfolio App
            </AppText>
            <AppText variant="caption" color="secondary" style={{ marginTop: 4, lineHeight: 18 }}>
              This application functions 100% offline using realistic local mock data and AsyncStorage. GPS telemetry is simulated through deterministically generated coordinate sequences. No paid APIs, trackers, or servers are required.
            </AppText>

            <AppButton
              title="Reset to Demo Data"
              onPress={() => setResetDialogOpen(true)}
              variant="outline"
              size="md"
              leftIcon="refresh"
              style={{ marginTop: 16 }}
            />
          </View>
        </AppCard>

        {/* About App Info */}
        <AppText variant="captionBold" color="secondary" style={styles.sectionTitle}>
          ABOUT
        </AppText>

        <AppCard style={styles.card} padding="md">
          <View style={styles.aboutRow}>
            <AppText variant="bodyMedium">Version</AppText>
            <AppText variant="caption" color="secondary">{APP_CONFIG.version} (Build {APP_CONFIG.build})</AppText>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.aboutRow}>
            <AppText variant="bodyMedium">License</AppText>
            <AppText variant="caption" color="secondary">MIT Open Source</AppText>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.aboutRow}>
            <AppText variant="bodyMedium">Created With</AppText>
            <AppText variant="caption" color="secondary">Expo • React Native • TypeScript</AppText>
          </View>
        </AppCard>
      </AppScrollView>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        visible={resetDialogOpen}
        title="Reset Demo Data?"
        message="This will restore the original mock pets (Bella and Luna), 7-day activity metrics, health logs, and reminders. Any customized pets will be reset."
        confirmText="Reset All Data"
        cancelText="Keep Data"
        isDestructive
        onConfirm={handleConfirmReset}
        onCancel={() => setResetDialogOpen(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  card: {
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  iconCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  labelCol: {
    marginLeft: 12,
    flex: 1,
  },
  unitBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  disclosureContent: {
    alignItems: 'flex-start',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
