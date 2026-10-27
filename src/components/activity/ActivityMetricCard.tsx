import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AppCard } from '../common/AppCard';
import { AppText } from '../common/AppText';
import { AppIcon, IconName } from '../common/AppIcon';

interface ActivityMetricCardProps {
  icon: IconName;
  iconColor?: string;
  label: string;
  value: string;
  subValue?: string;
  progressPercent?: number; // 0 - 100
  style?: ViewStyle;
}

export const ActivityMetricCard: React.FC<ActivityMetricCardProps> = ({
  icon,
  iconColor,
  label,
  value,
  subValue,
  progressPercent,
  style,
}) => {
  const { theme } = useTheme();
  const color = iconColor || theme.colors.primary;

  return (
    <AppCard style={[styles.card, style]} padding="sm">
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: `${color}18` },
          ]}
        >
          <AppIcon name={icon} size={20} color={color} />
        </View>
        {subValue && (
          <AppText variant="caption" color="secondary">
            {subValue}
          </AppText>
        )}
      </View>

      <AppText variant="h3" style={styles.value}>
        {value}
      </AppText>

      <AppText variant="caption" color="secondary">
        {label}
      </AppText>

      {progressPercent !== undefined && (
        <View
          style={[
            styles.progressBarBg,
            { backgroundColor: theme.colors.borderLight },
          ]}
        >
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      )}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    marginBottom: 2,
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
