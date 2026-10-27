import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store';
import { AppCard } from '../common/AppCard';
import { AppText } from '../common/AppText';
import { AppIcon } from '../common/AppIcon';
import { formatDuration } from '../../utils/dateUtils';
import { formatDistance } from '../../utils/calculations';

interface TrackingStatsBarProps {
  durationSeconds: number;
  distanceKm: number;
  speedKmh: number;
  batteryLevel?: number;
}

export const TrackingStatsBar: React.FC<TrackingStatsBarProps> = ({
  durationSeconds,
  distanceKm,
  speedKmh,
  batteryLevel = 88,
}) => {
  const { theme } = useTheme();
  const distanceUnit = useAppStore((state) => state.settings.distanceUnit);

  const speedConverted = distanceUnit === 'mi' ? speedKmh * 0.621371 : speedKmh;
  const speedUnit = distanceUnit === 'mi' ? 'mph' : 'km/h';

  return (
    <AppCard style={styles.container} padding="md">
      <View style={styles.row}>
        {/* Distance */}
        <View style={styles.statCol}>
          <View style={styles.iconLabelRow}>
            <AppIcon name="footsteps" size={14} color={theme.colors.primary} />
            <AppText variant="caption" color="secondary">
              Distance
            </AppText>
          </View>
          <AppText variant="title">
            {formatDistance(distanceKm, distanceUnit)}
          </AppText>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

        {/* Duration */}
        <View style={styles.statCol}>
          <View style={styles.iconLabelRow}>
            <AppIcon name="time-outline" size={14} color={theme.colors.primary} />
            <AppText variant="caption" color="secondary">
              Duration
            </AppText>
          </View>
          <AppText variant="title">
            {formatDuration(durationSeconds)}
          </AppText>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

        {/* Speed */}
        <View style={styles.statCol}>
          <View style={styles.iconLabelRow}>
            <AppIcon name="speedometer-outline" size={14} color={theme.colors.primary} />
            <AppText variant="caption" color="secondary">
              Speed
            </AppText>
          </View>
          <AppText variant="title">
            {speedConverted.toFixed(1)} {speedUnit}
          </AppText>
        </View>

        <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

        {/* Battery */}
        <View style={styles.statCol}>
          <View style={styles.iconLabelRow}>
            <AppIcon
              name={batteryLevel > 20 ? 'battery-charging' : 'battery-dead'}
              size={14}
              color={batteryLevel > 20 ? theme.colors.success : theme.colors.error}
            />
            <AppText variant="caption" color="secondary">
              Battery
            </AppText>
          </View>
          <AppText variant="title">
            {batteryLevel}%
          </AppText>
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  iconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  separator: {
    width: 1,
    height: 32,
  },
});
