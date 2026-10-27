import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { HealthRecord, HealthRecordType } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store';
import { AppCard } from '../common/AppCard';
import { AppText } from '../common/AppText';
import { AppIcon, IconName } from '../common/AppIcon';
import { formatDate } from '../../utils/dateUtils';
import { formatWeight } from '../../utils/calculations';

interface HealthRecordCardProps {
  record: HealthRecord;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const HealthRecordCard: React.FC<HealthRecordCardProps> = ({
  record,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();
  const weightUnit = useAppStore((state) => state.settings.weightUnit);

  const getRecordConfig = (type: HealthRecordType): { label: string; icon: IconName; color: string } => {
    switch (type) {
      case 'weight':
        return { label: 'Weight', icon: 'scale-outline', color: theme.colors.primary };
      case 'vaccination':
        return { label: 'Vaccine', icon: 'shield-checkmark-outline', color: theme.colors.success };
      case 'medication':
        return { label: 'Medication', icon: 'medkit-outline', color: theme.colors.warning };
      case 'vet_visit':
        return { label: 'Vet Visit', icon: 'fitness-outline', color: theme.colors.info };
      case 'observation':
      default:
        return { label: 'Observation', icon: 'eye-outline', color: '#8B5CF6' };
    }
  };

  const config = getRecordConfig(record.type);

  return (
    <AppCard style={styles.card} padding="md">
      <View style={styles.headerRow}>
        <View style={styles.typeBadgeRow}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: `${config.color}20` },
            ]}
          >
            <AppIcon name={config.icon} size={16} color={config.color} />
          </View>
          <View>
            <AppText variant="captionBold" customColor={config.color}>
              {config.label}
            </AppText>
            <AppText variant="caption" color="muted">
              {formatDate(record.date)}
            </AppText>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
              <AppIcon name="pencil" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
              <AppIcon name="trash-outline" size={16} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <AppText variant="bodyBold" style={styles.title}>
        {record.title}
      </AppText>

      {/* Specific Details */}
      {record.type === 'weight' && record.weightValue !== undefined && (
        <View style={styles.detailRow}>
          <AppText variant="caption" color="secondary">Recorded Weight: </AppText>
          <AppText variant="captionBold">
            {formatWeight(record.weightValue, weightUnit)}
          </AppText>
        </View>
      )}

      {record.type === 'vaccination' && (
        <View style={styles.detailCol}>
          {record.vaccineName && (
            <AppText variant="caption" color="secondary">
              Vaccine: <AppText variant="captionBold">{record.vaccineName}</AppText>
            </AppText>
          )}
          {record.nextDueDate && (
            <AppText variant="caption" color="secondary">
              Next Due: <AppText variant="captionBold">{formatDate(record.nextDueDate)}</AppText>
            </AppText>
          )}
          {record.clinicName && (
            <AppText variant="caption" color="muted">
              Clinic: {record.clinicName}
            </AppText>
          )}
        </View>
      )}

      {record.type === 'medication' && (
        <View style={styles.detailCol}>
          {record.medicationName && (
            <AppText variant="caption" color="secondary">
              Prescription: <AppText variant="captionBold">{record.medicationName}</AppText>
            </AppText>
          )}
          {record.dosage && (
            <AppText variant="caption" color="secondary">
              Dosage: <AppText variant="captionBold">{record.dosage}</AppText> ({record.frequency || 'Daily'})
            </AppText>
          )}
        </View>
      )}

      {record.type === 'vet_visit' && (
        <View style={styles.detailCol}>
          {record.vetName && (
            <AppText variant="caption" color="secondary">
              Attending Vet: <AppText variant="captionBold">{record.vetName}</AppText>
            </AppText>
          )}
          {record.clinicName && (
            <AppText variant="caption" color="muted">
              Hospital: {record.clinicName}
            </AppText>
          )}
        </View>
      )}

      {record.notes ? (
        <AppText variant="caption" color="secondary" style={styles.notes}>
          {record.notes}
        </AppText>
      ) : null}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
  },
  title: {
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailCol: {
    gap: 2,
    marginBottom: 4,
  },
  notes: {
    marginTop: 6,
    fontStyle: 'italic',
  },
});
