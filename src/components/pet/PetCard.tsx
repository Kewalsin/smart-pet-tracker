import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Pet } from '../../types';
import { useAppStore } from '../../store';
import { useTheme } from '../../hooks/useTheme';
import { AppCard } from '../common/AppCard';
import { AppText } from '../common/AppText';
import { AppIcon } from '../common/AppIcon';
import { PetAvatar } from './PetAvatar';
import { formatWeight } from '../../utils/calculations';

interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
  onDelete?: () => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onPress, onDelete }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const selectedPetId = useAppStore((state) => state.selectedPetId);
  const setSelectedPetId = useAppStore((state) => state.setSelectedPetId);
  const weightUnit = useAppStore((state) => state.settings.weightUnit);
  const trackerDevices = useAppStore((state) => state.trackerDevices);

  const isSelected = pet.id === selectedPetId;
  const tracker = trackerDevices[pet.id];

  const handleSelect = (e: any) => {
    e.stopPropagation?.();
    setSelectedPetId(pet.id);
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/pets/${pet.id}`);
    }
  };

  return (
    <AppCard
      onPress={handleCardPress}
      style={[
        styles.card,
        isSelected ? {
          borderColor: theme.colors.primary,
          borderWidth: 2,
        } : undefined,
      ]}
      padding="md"
    >
      <View style={styles.topRow}>
        <PetAvatar photoUrl={pet.photoUrl} species={pet.species} size={64} />

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <AppText variant="title">{pet.name}</AppText>
            {isSelected ? (
              <View
                style={[
                  styles.activeBadge,
                  { backgroundColor: theme.colors.primaryUltraLight },
                ]}
              >
                <AppText variant="badge" color="brand">
                  Active
                </AppText>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleSelect}
                style={[
                  styles.selectButton,
                  { borderColor: theme.colors.border },
                ]}
              >
                <AppText variant="caption" color="secondary">
                  Select
                </AppText>
              </TouchableOpacity>
            )}
          </View>

          <AppText variant="body" color="secondary">
            {pet.breed} • {pet.ageYears} {pet.ageYears === 1 ? 'yr' : 'yrs'} old
          </AppText>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <AppIcon name="scale-outline" size={14} color={theme.colors.textMuted} />
              <AppText variant="caption" color="secondary" style={styles.metaText}>
                {formatWeight(pet.weight, weightUnit)}
              </AppText>
            </View>

            {tracker && (
              <View style={styles.metaItem}>
                <AppIcon
                  name={tracker.batteryLevel > 20 ? 'battery-charging' : 'battery-dead'}
                  size={14}
                  color={tracker.batteryLevel > 20 ? theme.colors.success : theme.colors.error}
                />
                <AppText variant="caption" color="secondary" style={styles.metaText}>
                  {tracker.batteryLevel}%
                </AppText>
              </View>
            )}

            <View style={styles.metaItem}>
              <AppIcon name="hardware-chip-outline" size={14} color={theme.colors.textMuted} />
              <AppText variant="caption" color="secondary" style={styles.metaText}>
                {pet.trackerDeviceId || 'No Device'}
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {pet.notes ? (
        <View
          style={[
            styles.notesContainer,
            { backgroundColor: theme.colors.cardAlt },
          ]}
        >
          <AppText variant="caption" color="secondary" numberOfLines={2}>
            {pet.notes}
          </AppText>
        </View>
      ) : null}

      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={() => router.push(`/pets/${pet.id}`)}
          style={styles.actionLink}
        >
          <AppText variant="captionBold" color="brand">
            View Profile & Edit
          </AppText>
          <AppIcon name="chevron-forward" size={14} color={theme.colors.primary} />
        </TouchableOpacity>

        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteLink}>
            <AppIcon name="trash-outline" size={16} color={theme.colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  selectButton: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    marginLeft: 2,
  },
  notesContainer: {
    marginTop: 12,
    padding: 8,
    borderRadius: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  deleteLink: {
    padding: 4,
  },
});
