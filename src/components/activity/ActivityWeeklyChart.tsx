import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { ActivityRecord } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { getDayLabel } from '../../utils/dateUtils';
import { AppText } from '../common/AppText';

interface ActivityWeeklyChartProps {
  records: ActivityRecord[];
  metric: 'steps' | 'distance';
  goal?: number;
}

export const ActivityWeeklyChart: React.FC<ActivityWeeklyChartProps> = ({
  records,
  metric = 'steps',
  goal = 8000,
}) => {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 64; // accounting for padding
  const chartHeight = 160;

  // Take the most recent 7 records and sort chronologically (oldest to newest)
  const sortedRecords = [...records]
    .slice(0, 7)
    .reverse();

  const values = sortedRecords.map((r) => (metric === 'steps' ? r.steps : r.distanceKm));
  const maxValue = Math.max(...values, goal, 1);

  const barWidth = Math.min(28, (chartWidth / Math.max(sortedRecords.length, 1)) * 0.55);
  const chartPaddingTop = 20;
  const chartPaddingBottom = 28;
  const usableHeight = chartHeight - chartPaddingTop - chartPaddingBottom;

  const goalY = chartPaddingTop + usableHeight - (goal / maxValue) * usableHeight;

  return (
    <View style={styles.container}>
      <View style={styles.chartHeader}>
        <AppText variant="captionBold" color="secondary">
          Weekly Trend ({metric === 'steps' ? 'Steps' : 'km'})
        </AppText>
        <AppText variant="caption" color="muted">
          Goal: {goal.toLocaleString()}
        </AppText>
      </View>

      <Svg width={chartWidth} height={chartHeight}>
        {/* Goal line */}
        <Line
          x1={0}
          y1={goalY}
          x2={chartWidth}
          y2={goalY}
          stroke={theme.colors.primary}
          strokeDasharray="4, 4"
          strokeWidth={1}
          opacity={0.4}
        />

        {sortedRecords.map((record, index) => {
          const val = metric === 'steps' ? record.steps : record.distanceKm;
          const barHeight = Math.max(4, (val / maxValue) * usableHeight);
          const x =
            (chartWidth / sortedRecords.length) * index +
            (chartWidth / sortedRecords.length - barWidth) / 2;
          const y = chartPaddingTop + usableHeight - barHeight;
          const isLatest = index === sortedRecords.length - 1;
          const dayLabel = getDayLabel(record.date);

          return (
            <G key={record.id || index}>
              {/* Background bar */}
              <Rect
                x={x}
                y={chartPaddingTop}
                width={barWidth}
                height={usableHeight}
                rx={barWidth / 2}
                fill={theme.colors.cardAlt}
              />
              {/* Active bar */}
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={barWidth / 2}
                fill={isLatest ? theme.colors.primary : theme.colors.primaryLight}
              />
              {/* Day label */}
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight - 8}
                fontSize="11"
                fill={isLatest ? theme.colors.primary : theme.colors.textSecondary}
                fontWeight={isLatest ? 'bold' : 'normal'}
                textAnchor="middle"
              >
                {dayLabel}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
