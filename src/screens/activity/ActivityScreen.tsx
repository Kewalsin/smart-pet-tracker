import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '../../store';
import { useTheme } from '../../hooks/useTheme';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppScrollView } from '../../components/layout/AppScrollView';
import { AppHeader } from '../../components/common/AppHeader';
import { AppCard } from '../../components/common/AppCard';
import { AppText } from '../../components/common/AppText';
import { AppIcon } from '../../components/common/AppIcon';
import { PetSelector } from '../../components/pet/PetSelector';
import { ActivityWeeklyChart } from '../../components/activity/ActivityWeeklyChart';
import { ActivityMetricCard } from '../../components/activity/ActivityMetricCard';
import { calculateWeeklyTotals, formatDistance } from '../../utils/calculations';
import { formatDate } from '../../utils/dateUtils';
import { ActivityFilterPeriod } from '../../types';

export const ActivityScreen: React.FC = () => {
  const { theme } = useTheme();

  const pets = useAppStore((state) => state.pets);
  const selectedPetId = useAppStore((state) => state.selectedPetId);
  const activityRecords = useAppStore((state) => state.activityRecords);
  const settings = useAppStore((state) => state.settings);

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const [period, setPeriod] = useState<ActivityFilterPeriod>('week');
  const [chartMetric, setChartMetric] = useState<'steps' | 'distance'>('steps');

  // Filter records for active pet
  const petRecords = activityRecords.filter((r) => r.petId === activePet?.id);

  const totals = calculateWeeklyTotals(petRecords);

  return (
    <ScreenContainer>
      <AppHeader
        title="Activity Analytics"
        subtitle={activePet ? `${activePet.name}'s fitness & health` : undefined}
        showBackButton
        style={styles.header}
      />

      <AppScrollView contentContainerStyle={styles.content}>
        {/* Pet Switcher */}
        <PetSelector />

        {/* Filter Period Tabs */}
        <View
          style={[
            styles.tabBar,
            {
              backgroundColor: theme.colors.cardAlt,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {(['day', 'week', 'month'] as ActivityFilterPeriod[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setPeriod(tab)}
              style={[
                styles.tabItem,
                period === tab && {
                  backgroundColor: theme.colors.card,
                  ...theme.shadows.sm,
                },
              ]}
            >
              <AppText
                variant="captionBold"
                color={period === tab ? 'brand' : 'secondary'}
                style={styles.tabText}
              >
                {tab.toUpperCase()}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metric Overview Grid */}
        <View style={styles.metricRow}>
          <ActivityMetricCard
            icon="footsteps"
            label="Avg Steps/Day"
            value={totals.avgSteps.toLocaleString()}
            subValue="Goal: 8,000"
            progressPercent={(totals.avgSteps / 8000) * 100}
          />
          <ActivityMetricCard
            icon="map-outline"
            label="Total Distance"
            value={formatDistance(totals.totalDistanceKm, settings.distanceUnit)}
            subValue="This Week"
            progressPercent={85}
            iconColor={theme.colors.info}
          />
        </View>

        <View style={[styles.metricRow, { marginTop: 10 }]}>
          <ActivityMetricCard
            icon="timer-outline"
            label="Active Time"
            value={`${totals.totalActiveMinutes} min`}
            subValue={`Avg ${totals.avgActiveMinutes}m/d`}
            progressPercent={(totals.avgActiveMinutes / 60) * 100}
            iconColor={theme.colors.warning}
          />
          <ActivityMetricCard
            icon="flame-outline"
            label="Calories Burned"
            value={`${totals.totalCalories} kcal`}
            subValue="Total"
            progressPercent={90}
            iconColor="#EC4899"
          />
        </View>

        {/* Weekly Trend Chart Card */}
        <AppCard style={styles.chartCard} padding="md">
          <View style={styles.chartToggleRow}>
            <AppText variant="title">Activity Trends</AppText>
            <View style={styles.metricToggleButtons}>
              <TouchableOpacity
                onPress={() => setChartMetric('steps')}
                style={[
                  styles.metricBtn,
                  chartMetric === 'steps' && {
                    backgroundColor: theme.colors.primaryUltraLight,
                    borderColor: theme.colors.primary,
                  },
                ]}
              >
                <AppText
                  variant="captionBold"
                  color={chartMetric === 'steps' ? 'brand' : 'secondary'}
                >
                  Steps
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setChartMetric('distance')}
                style={[
                  styles.metricBtn,
                  chartMetric === 'distance' && {
                    backgroundColor: theme.colors.primaryUltraLight,
                    borderColor: theme.colors.primary,
                  },
                ]}
              >
                <AppText
                  variant="captionBold"
                  color={chartMetric === 'distance' ? 'brand' : 'secondary'}
                >
                  Distance
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          <ActivityWeeklyChart
            records={petRecords}
            metric={chartMetric}
            goal={chartMetric === 'steps' ? 8000 : 5}
          />
        </AppCard>

        {/* Activity Breakdown Breakdown */}
        <AppCard style={styles.breakdownCard} padding="md">
          <AppText variant="title" style={styles.sectionTitle}>
            Daily Activity Distribution
          </AppText>
          <View style={styles.barContainer}>
            <View style={[styles.barSegment, { flex: 6, backgroundColor: theme.colors.primary }]} />
            <View style={[styles.barSegment, { flex: 3, backgroundColor: theme.colors.warning }]} />
            <View style={[styles.barSegment, { flex: 15, backgroundColor: theme.colors.border }]} />
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
              <AppText variant="caption" color="secondary">Walking (25%)</AppText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.warning }]} />
              <AppText variant="caption" color="secondary">Play (12%)</AppText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.border }]} />
              <AppText variant="caption" color="secondary">Rest (63%)</AppText>
            </View>
          </View>
        </AppCard>

        {/* Activity Log List */}
        <View style={styles.sectionHeader}>
          <AppText variant="title">Activity History</AppText>
          <AppText variant="caption" color="muted">
            {petRecords.length} records
          </AppText>
        </View>

        {petRecords.map((item) => (
          <AppCard key={item.id} style={styles.logCard} padding="sm">
            <View style={styles.logRow}>
              <View
                style={[
                  styles.logIconWrapper,
                  { backgroundColor: theme.colors.primaryUltraLight },
                ]}
              >
                <AppIcon name="paw" size={18} color={theme.colors.primary} />
              </View>
              <View style={styles.logDetails}>
                <AppText variant="bodyBold">{formatDate(item.date)}</AppText>
                <AppText variant="caption" color="secondary">
                  {item.steps.toLocaleString()} steps • {formatDistance(item.distanceKm, settings.distanceUnit)}
                </AppText>
              </View>
              <View style={styles.logRight}>
                <AppText variant="captionBold" color="brand">
                  {item.activeMinutes} min
                </AppText>
                <AppText variant="caption" color="muted">
                  {item.calories} kcal
                </AppText>
              </View>
            </View>
          </AppCard>
        ))}
      </AppScrollView>
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
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    letterSpacing: 0.5,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chartCard: {
    marginTop: 16,
  },
  chartToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricToggleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  breakdownCard: {
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  barContainer: {
    height: 12,
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  barSegment: {
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  logCard: {
    marginBottom: 8,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logDetails: {
    flex: 1,
  },
  logRight: {
    alignItems: 'flex-end',
  },
});
