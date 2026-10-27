import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ActivityRecord } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store';
import { AppCard } from '../common/AppCard';
import { AppText } from '../common/AppText';
import { AppIcon } from '../common/AppIcon';
import {
  getActivityHeatLevel,
  getHeatColor,
  calculateYearlyStats,
  HeatIntensity,
} from '../../utils/activityGenerator';
import { formatDistance } from '../../utils/calculations';
import { formatDate } from '../../utils/dateUtils';

interface ActivityHeatmapProps {
  records: ActivityRecord[];
  goal?: number;
  initialYear?: number;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  records,
  goal = 8000,
  initialYear = 2026,
}) => {
  const { theme, isDark } = useTheme();
  const settings = useAppStore((state) => state.settings);

  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [selectedRecord, setSelectedRecord] = useState<ActivityRecord | null>(null);

  const availableYears = [2026, 2025, 2024, 2023];

  // Map records by YYYY-MM-DD for O(1) lookup
  const recordMap = useMemo(() => {
    const map = new Map<string, ActivityRecord>();
    records.forEach((r) => map.set(r.date, r));
    return map;
  }, [records]);

  // Generate calendar grid (52/53 weeks x 7 days) for the selected year
  const { weeks, monthLabels } = useMemo(() => {
    const grid: { date: string; record?: ActivityRecord; intensity: HeatIntensity; month: number }[][] = [];
    const labels: { name: string; weekIndex: number }[] = [];

    const jan1 = new Date(Date.UTC(selectedYear, 0, 1));
    const dec31 = new Date(Date.UTC(selectedYear, 11, 31));

    // Align start to the nearest Monday (0=Sun, 1=Mon, ..., 6=Sat)
    const startDate = new Date(jan1);
    const dayOfWeek = startDate.getUTCDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setUTCDate(startDate.getUTCDate() + diffToMonday);

    let curr = new Date(startDate);
    let lastMonth = -1;
    let weekIndex = 0;

    while (curr <= dec31 || curr.getUTCDay() !== 1) {
      const currentWeek: { date: string; record?: ActivityRecord; intensity: HeatIntensity; month: number }[] = [];

      for (let d = 0; d < 7; d++) {
        const dateStr = curr.toISOString().split('T')[0];
        const isCurrentYear = curr.getUTCFullYear() === selectedYear;

        let intensity: HeatIntensity = 0;
        let rec: ActivityRecord | undefined;

        if (isCurrentYear) {
          rec = recordMap.get(dateStr);
          if (rec) {
            intensity = getActivityHeatLevel(rec.steps, goal);
          }

          const m = curr.getUTCMonth();
          if (m !== lastMonth && d === 0) {
            labels.push({
              name: curr.toLocaleString('en-US', { month: 'short' }),
              weekIndex,
            });
            lastMonth = m;
          }
        }

        currentWeek.push({
          date: dateStr,
          record: rec,
          intensity,
          month: curr.getUTCMonth(),
        });

        curr.setUTCDate(curr.getUTCDate() + 1);
      }

      grid.push(currentWeek);
      weekIndex++;
      if (curr > dec31 && curr.getUTCDay() === 1) break;
    }

    return { weeks: grid, monthLabels: labels };
  }, [selectedYear, recordMap, goal]);

  const stats = useMemo(() => {
    return calculateYearlyStats(records, selectedYear, goal);
  }, [records, selectedYear, goal]);

  return (
    <AppCard style={styles.card} padding="md">
      {/* Header and Year Tabs */}
      <View style={styles.headerRow}>
        <View>
          <AppText variant="title">Activity Heatmap</AppText>
          <AppText variant="caption" color="secondary">
            Daily consistency & walk frequency
          </AppText>
        </View>

        {/* Year Selector */}
        <View style={styles.yearPicker}>
          {availableYears.map((year) => (
            <TouchableOpacity
              key={year}
              onPress={() => {
                setSelectedYear(year);
                setSelectedRecord(null);
              }}
              style={[
                styles.yearBtn,
                {
                  backgroundColor:
                    selectedYear === year
                      ? theme.colors.primaryUltraLight
                      : theme.colors.cardAlt,
                  borderColor:
                    selectedYear === year
                      ? theme.colors.primary
                      : theme.colors.border,
                },
              ]}
            >
              <AppText
                variant="captionBold"
                color={selectedYear === year ? 'brand' : 'secondary'}
              >
                {year}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Annual Summary Stats Grid */}
      <View style={styles.statsBanner}>
        <View style={styles.statItem}>
          <AppText variant="caption" color="secondary">Yearly Steps</AppText>
          <AppText variant="bodyBold" color="brand">
            {stats.totalSteps.toLocaleString()}
          </AppText>
        </View>

        <View style={[styles.statSep, { backgroundColor: theme.colors.border }]} />

        <View style={styles.statItem}>
          <AppText variant="caption" color="secondary">Total Distance</AppText>
          <AppText variant="bodyBold">
            {formatDistance(stats.totalDistanceKm, settings.distanceUnit, 0)}
          </AppText>
        </View>

        <View style={[styles.statSep, { backgroundColor: theme.colors.border }]} />

        <View style={styles.statItem}>
          <AppText variant="caption" color="secondary">Best Streak</AppText>
          <AppText variant="bodyBold" customColor="#F59E0B">
            🔥 {stats.longestStreak} days
          </AppText>
        </View>

        <View style={[styles.statSep, { backgroundColor: theme.colors.border }]} />

        <View style={styles.statItem}>
          <AppText variant="caption" color="secondary">Goals Crushed</AppText>
          <AppText variant="bodyBold" color="success">
            {stats.goalMetDays} d
          </AppText>
        </View>
      </View>

      {/* GitHub-style Contribution Scrollable Matrix */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.matrixScroll}
      >
        <View>
          {/* Month Labels Bar */}
          <View style={styles.monthLabelsRow}>
            {monthLabels.map((lbl, idx) => (
              <AppText
                key={idx}
                variant="caption"
                color="muted"
                style={[styles.monthLabelText, { left: lbl.weekIndex * 15 }]}
              >
                {lbl.name}
              </AppText>
            ))}
          </View>

          {/* Day of Week Row Labels & Grid Tiles */}
          <View style={styles.gridRow}>
            {/* Days of week labels (Mon, Wed, Fri) */}
            <View style={styles.dayLabelsCol}>
              <AppText variant="caption" color="muted" style={styles.dayLabel}>Mon</AppText>
              <View style={{ height: 14 }} />
              <AppText variant="caption" color="muted" style={styles.dayLabel}>Wed</AppText>
              <View style={{ height: 14 }} />
              <AppText variant="caption" color="muted" style={styles.dayLabel}>Fri</AppText>
            </View>

            {/* Weeks Columns */}
            <View style={styles.weeksContainer}>
              {weeks.map((week, wIdx) => (
                <View key={wIdx} style={styles.weekCol}>
                  {week.map((day, dIdx) => {
                    const color = getHeatColor(day.intensity, isDark);
                    const isSelected = selectedRecord?.date === day.date;

                    return (
                      <TouchableOpacity
                        key={dIdx}
                        onPress={() => {
                          if (day.record) setSelectedRecord(day.record);
                        }}
                        activeOpacity={0.7}
                        style={[
                          styles.tile,
                          {
                            backgroundColor: color,
                            borderColor: isSelected ? theme.colors.primary : 'transparent',
                            borderWidth: isSelected ? 1.5 : 0,
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Legend Row */}
      <View style={styles.legendRow}>
        <AppText variant="caption" color="muted">
          Less
        </AppText>
        <View style={styles.legendTiles}>
          <View style={[styles.legendTile, { backgroundColor: getHeatColor(0, isDark) }]} />
          <View style={[styles.legendTile, { backgroundColor: getHeatColor(1, isDark) }]} />
          <View style={[styles.legendTile, { backgroundColor: getHeatColor(2, isDark) }]} />
          <View style={[styles.legendTile, { backgroundColor: getHeatColor(3, isDark) }]} />
        </View>
        <AppText variant="caption" color="muted">
          More (Goal 8k+)
        </AppText>
      </View>

      {/* Selected Day Info Popup Box */}
      {selectedRecord && (
        <View
          style={[
            styles.selectedInfoBox,
            {
              backgroundColor: theme.colors.cardAlt,
              borderColor: theme.colors.primary,
            },
          ]}
        >
          <View style={styles.selectedTop}>
            <View style={styles.selectedTitleRow}>
              <AppIcon name="calendar-outline" size={16} color={theme.colors.primary} />
              <AppText variant="bodyBold">
                {formatDate(selectedRecord.date)}
              </AppText>
            </View>
            <TouchableOpacity onPress={() => setSelectedRecord(null)}>
              <AppIcon name="close" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.selectedStatsRow}>
            <AppText variant="caption" color="secondary">
              👣 <AppText variant="captionBold">{selectedRecord.steps.toLocaleString()} steps</AppText>
            </AppText>
            <AppText variant="caption" color="secondary">
              📍 <AppText variant="captionBold">{formatDistance(selectedRecord.distanceKm, settings.distanceUnit)}</AppText>
            </AppText>
            <AppText variant="caption" color="secondary">
              ⏱️ <AppText variant="captionBold">{selectedRecord.activeMinutes} min</AppText>
            </AppText>
            <AppText variant="caption" color="secondary">
              🔥 <AppText variant="captionBold">{selectedRecord.calories} kcal</AppText>
            </AppText>
          </View>
        </View>
      )}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  yearPicker: {
    flexDirection: 'row',
    gap: 4,
  },
  yearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statSep: {
    width: 1,
    height: 28,
  },
  matrixScroll: {
    paddingBottom: 8,
  },
  monthLabelsRow: {
    height: 18,
    position: 'relative',
    marginLeft: 30,
    marginBottom: 4,
  },
  monthLabelText: {
    position: 'absolute',
    fontSize: 10,
  },
  gridRow: {
    flexDirection: 'row',
  },
  dayLabelsCol: {
    width: 28,
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  dayLabel: {
    fontSize: 9,
  },
  weeksContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  weekCol: {
    flexDirection: 'column',
    gap: 3,
  },
  tile: {
    width: 11,
    height: 11,
    borderRadius: 2.5,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 12,
  },
  legendTiles: {
    flexDirection: 'row',
    gap: 3,
  },
  legendTile: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  selectedInfoBox: {
    marginTop: 14,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  selectedTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  selectedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
