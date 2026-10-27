import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Reminder, ReminderCategory } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { AppCard } from '../common/AppCard';
import { AppText } from '../common/AppText';
import { AppIcon, IconName } from '../common/AppIcon';
import { formatDateTime, isDueSoon, isOverdue } from '../../utils/dateUtils';

interface ReminderItemProps {
  reminder: Reminder;
  onToggleComplete: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ReminderItem: React.FC<ReminderItemProps> = ({
  reminder,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();

  const getCategoryConfig = (cat: ReminderCategory): { icon: IconName; color: string } => {
    switch (cat) {
      case 'walk':
        return { icon: 'footsteps-outline', color: theme.colors.primary };
      case 'medication':
        return { icon: 'medkit-outline', color: theme.colors.warning };
      case 'feeding':
        return { icon: 'restaurant-outline', color: '#F97316' };
      case 'vet':
        return { icon: 'fitness-outline', color: theme.colors.info };
      case 'grooming':
        return { icon: 'cut-outline', color: '#EC4899' };
      case 'other':
      default:
        return { icon: 'notifications-outline', color: theme.colors.textSecondary };
    }
  };

  const config = getCategoryConfig(reminder.category);
  const overdue = !reminder.isCompleted && isOverdue(reminder.dateTime);
  const dueSoon = !reminder.isCompleted && isDueSoon(reminder.dateTime);

  return (
    <AppCard
      style={[
        styles.card,
        reminder.isCompleted ? { opacity: 0.65 } : undefined,
      ]}
      padding="sm"
    >
      <View style={styles.row}>
        {/* Checkbox */}
        <TouchableOpacity
          onPress={onToggleComplete}
          style={[
            styles.checkbox,
            {
              borderColor: reminder.isCompleted ? theme.colors.success : theme.colors.border,
              backgroundColor: reminder.isCompleted ? theme.colors.success : 'transparent',
            },
          ]}
          activeOpacity={0.7}
        >
          {reminder.isCompleted && (
            <AppIcon name="checkmark" size={16} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.contentCol}>
          <View style={styles.titleRow}>
            <AppText
              variant="bodyMedium"
              style={[
                styles.title,
                reminder.isCompleted ? styles.completedText : undefined,
              ]}
              numberOfLines={1}
            >
              {reminder.title}
            </AppText>

            {overdue && (
              <View style={[styles.badge, { backgroundColor: theme.colors.errorBg }]}>
                <AppText variant="badge" color="error">
                  Overdue
                </AppText>
              </View>
            )}
            {dueSoon && !overdue && (
              <View style={[styles.badge, { backgroundColor: theme.colors.warningBg }]}>
                <AppText variant="badge" color="warning">
                  Due Soon
                </AppText>
              </View>
            )}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.categoryTag}>
              <AppIcon name={config.icon} size={12} color={config.color} />
              <AppText variant="caption" customColor={config.color} style={styles.categoryLabel}>
                {reminder.category}
              </AppText>
            </View>

            <AppText variant="caption" color="muted">
              • {formatDateTime(reminder.dateTime)}
            </AppText>
          </View>

          {reminder.notes ? (
            <AppText variant="caption" color="secondary" style={styles.notes} numberOfLines={1}>
              {reminder.notes}
            </AppText>
          ) : null}
        </View>

        {/* Actions */}
        <View style={styles.actionButtons}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
              <AppIcon name="pencil" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
              <AppIcon name="trash-outline" size={16} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryLabel: {
    textTransform: 'capitalize',
  },
  notes: {
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtn: {
    padding: 6,
  },
});
