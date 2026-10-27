import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { useTheme } from '../../hooks/useTheme';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppScrollView } from '../../components/layout/AppScrollView';
import { AppText } from '../../components/common/AppText';
import { AppCard } from '../../components/common/AppCard';
import { AppButton } from '../../components/common/AppButton';
import { AppIcon } from '../../components/common/AppIcon';
import { PetSelector } from '../../components/pet/PetSelector';
import { ActivityMetricCard } from '../../components/activity/ActivityMetricCard';
import { ReminderItem } from '../../components/reminders/ReminderItem';
import { formatDate, getIsoDateToday } from '../../utils/dateUtils';
import { formatDistance, formatWeight } from '../../utils/calculations';

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const pets = useAppStore((state) => state.pets);
  const selectedPetId = useAppStore((state) => state.selectedPetId);
  const activityRecords = useAppStore((state) => state.activityRecords);
  const reminders = useAppStore((state) => state.reminders);
  const healthRecords = useAppStore((state) => state.healthRecords);
  const trackerDevices = useAppStore((state) => state.trackerDevices);
  const settings = useAppStore((state) => state.settings);
  const toggleReminderComplete = useAppStore((state) => state.toggleReminderComplete);

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const tracker = activePet ? trackerDevices[activePet.id] : null;

  // Find today's activity record for active pet or compute defaults
  const todayIso = getIsoDateToday();
  const todayRecord = activityRecords.find(
    (r) => r.petId === activePet?.id && r.date === todayIso
  ) || {
    steps: 7240,
    distanceKm: 5.2,
    activeMinutes: 65,
    calories: 340,
  };

  // Filter upcoming reminders for selected pet (limit to 3)
  const petReminders = reminders
    .filter((r) => r.petId === activePet?.id && !r.isCompleted)
    .slice(0, 3);

  // Latest health records for this pet
  const petHealth = healthRecords
    .filter((r) => r.petId === activePet?.id)
    .slice(0, 2);

  const batteryColor =
    !tracker || tracker.batteryLevel > 40
      ? theme.colors.success
      : tracker.batteryLevel > 20
      ? theme.colors.warning
      : theme.colors.error;

  return (
    <ScreenContainer>
      <AppScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Greeting & Date */}
        <View style={styles.header}>
          <View>
            <AppText variant="caption" color="secondary">
              {formatDate(new Date())}
            </AppText>
            <AppText variant="h2">PetPulse</AppText>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            style={[
              styles.settingsBtn,
              {
                backgroundColor: theme.colors.cardAlt,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <AppIcon name="settings-outline" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Pet Switcher Bar */}
        <PetSelector />

        {/* Selected Pet Banner Card */}
        {activePet && (
          <AppCard style={styles.petBannerCard} padding="md">
            <View style={styles.bannerRow}>
              <View style={styles.bannerInfo}>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.speciesBadge,
                      { backgroundColor: theme.colors.primaryUltraLight },
                    ]}
                  >
                    <AppText variant="badge" color="brand">
                      {activePet.species.toUpperCase()}
                    </AppText>
                  </View>
                  <AppText variant="caption" color="muted">
                    • {formatWeight(activePet.weight, settings.weightUnit)}
                  </AppText>
                </View>

                <AppText variant="h3">{activePet.name}</AppText>
                <AppText variant="caption" color="secondary">
                  {activePet.breed} • {activePet.ageYears} yrs old
                </AppText>
              </View>

              {/* Tracker status pill */}
              <TouchableOpacity
                onPress={() => router.push('/tracking')}
                style={[
                  styles.trackerPill,
                  {
                    backgroundColor: theme.colors.cardAlt,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <AppIcon
                  name={tracker?.isConnected ? 'wifi' : 'wifi-outline'}
                  size={14}
                  color={theme.colors.primary}
                />
                <AppIcon
                  name="battery-charging"
                  size={14}
                  color={batteryColor}
                />
                <AppText variant="captionBold">
                  {tracker?.batteryLevel ?? 85}%
                </AppText>
              </TouchableOpacity>
            </View>
          </AppCard>
        )}

        {/* Daily Activity Stats Grid */}
        <View style={styles.sectionHeader}>
          <AppText variant="title">Today's Activity</AppText>
          <TouchableOpacity onPress={() => router.push('/activity')}>
            <AppText variant="captionBold" color="brand">
              Analytics →
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.metricGrid}>
          <ActivityMetricCard
            icon="footsteps"
            label="Daily Steps"
            value={todayRecord.steps.toLocaleString()}
            subValue="Goal: 8,000"
            progressPercent={(todayRecord.steps / 8000) * 100}
          />
          <ActivityMetricCard
            icon="map-outline"
            label="Distance"
            value={formatDistance(todayRecord.distanceKm, settings.distanceUnit)}
            subValue="Goal: 5.0"
            progressPercent={(todayRecord.distanceKm / 5) * 100}
            iconColor={theme.colors.info}
          />
        </View>

        <View style={[styles.metricGrid, { marginTop: 10 }]}>
          <ActivityMetricCard
            icon="timer-outline"
            label="Active Time"
            value={`${todayRecord.activeMinutes} min`}
            subValue="Goal: 60 min"
            progressPercent={(todayRecord.activeMinutes / 60) * 100}
            iconColor={theme.colors.warning}
          />
          <ActivityMetricCard
            icon="flame-outline"
            label="Calories"
            value={`${todayRecord.calories} kcal`}
            subValue="Burned"
            progressPercent={85}
            iconColor="#EC4899"
          />
        </View>

        {/* Live GPS Tracker Promo Card */}
        <AppCard
          style={styles.trackingCard}
          onPress={() => router.push('/tracking')}
          padding="md"
        >
          <View style={styles.trackingRow}>
            <View
              style={[
                styles.radarCircle,
                { backgroundColor: theme.colors.primaryUltraLight },
              ]}
            >
              <AppIcon name="navigate" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.trackingTextCol}>
              <View style={styles.badgeLine}>
                <AppText variant="bodyBold">Live Pet Tracker</AppText>
                <View
                  style={[
                    styles.simTag,
                    { backgroundColor: theme.colors.successBg },
                  ]}
                >
                  <AppText variant="badge" color="success">
                    DEMO ACTIVE
                  </AppText>
                </View>
              </View>
              <AppText variant="caption" color="secondary">
                Track {activePet?.name || 'pet'}'s live simulated route & distance.
              </AppText>
            </View>
            <AppIcon name="chevron-forward" size={20} color={theme.colors.textMuted} />
          </View>
        </AppCard>

        {/* Quick Actions Bar */}
        <View style={styles.sectionHeader}>
          <AppText variant="title">Quick Actions</AppText>
        </View>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={[styles.quickActionItem, { backgroundColor: theme.colors.card }]}
            onPress={() => router.push('/tracking')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: theme.colors.primaryUltraLight }]}>
              <AppIcon name="walk-outline" size={22} color={theme.colors.primary} />
            </View>
            <AppText variant="captionBold" align="center">
              Start Walk
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionItem, { backgroundColor: theme.colors.card }]}
            onPress={() => router.push('/health')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#EDE9FE' }]}>
              <AppIcon name="medkit-outline" size={22} color="#8B5CF6" />
            </View>
            <AppText variant="captionBold" align="center">
              Log Health
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionItem, { backgroundColor: theme.colors.card }]}
            onPress={() => router.push('/reminders/add')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <AppIcon name="alarm-outline" size={22} color={theme.colors.warning} />
            </View>
            <AppText variant="captionBold" align="center">
              Reminder
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionItem, { backgroundColor: theme.colors.card }]}
            onPress={() => router.push('/pets')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: theme.colors.primaryUltraLight }]}>
              <AppIcon name="paw-outline" size={22} color={theme.colors.primary} />
            </View>
            <AppText variant="captionBold" align="center">
              All Pets
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Upcoming Reminders Section */}
        <View style={styles.sectionHeader}>
          <AppText variant="title">Upcoming Reminders</AppText>
          <TouchableOpacity onPress={() => router.push('/reminders')}>
            <AppText variant="captionBold" color="brand">
              View All ({reminders.filter((r) => !r.isCompleted).length})
            </AppText>
          </TouchableOpacity>
        </View>

        {petReminders.length > 0 ? (
          petReminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              onToggleComplete={() => toggleReminderComplete(reminder.id)}
            />
          ))
        ) : (
          <AppCard padding="md" style={styles.emptyCard}>
            <AppText variant="body" color="secondary" align="center">
              No pending reminders for {activePet?.name}.
            </AppText>
          </AppCard>
        )}

        {/* Health Summary Card */}
        <View style={styles.sectionHeader}>
          <AppText variant="title">Health Overview</AppText>
          <TouchableOpacity onPress={() => router.push('/health')}>
            <AppText variant="captionBold" color="brand">
              Records →
            </AppText>
          </TouchableOpacity>
        </View>

        <AppCard padding="md">
          <View style={styles.healthSummaryRow}>
            <View style={styles.healthStat}>
              <AppText variant="caption" color="secondary">Current Weight</AppText>
              <AppText variant="title">
                {formatWeight(activePet?.weight || 0, settings.weightUnit)}
              </AppText>
              <AppText variant="caption" color="success">Optimal BCS</AppText>
            </View>
            <View style={[styles.healthSep, { backgroundColor: theme.colors.border }]} />
            <View style={styles.healthStat}>
              <AppText variant="caption" color="secondary">Vaccinations</AppText>
              <AppText variant="title">Up to Date</AppText>
              <AppText variant="caption" color="secondary">Booster in 2027</AppText>
            </View>
          </View>
        </AppCard>
      </AppScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petBannerCard: {
    marginBottom: 16,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  speciesBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trackerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 12,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  trackingCard: {
    marginTop: 16,
  },
  trackingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trackingTextCol: {
    flex: 1,
  },
  badgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  simTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB20',
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  healthSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  healthStat: {
    alignItems: 'center',
  },
  healthSep: {
    width: 1,
    height: 40,
  },
});
