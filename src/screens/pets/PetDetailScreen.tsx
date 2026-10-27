import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppStore } from '../../store';
import { useTheme } from '../../hooks/useTheme';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppScrollView } from '../../components/layout/AppScrollView';
import { AppHeader } from '../../components/common/AppHeader';
import { AppCard } from '../../components/common/AppCard';
import { AppText } from '../../components/common/AppText';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { AppIcon } from '../../components/common/AppIcon';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatWeight } from '../../utils/calculations';
import { formatDate } from '../../utils/dateUtils';

export const PetDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();

  const pets = useAppStore((state) => state.pets);
  const updatePet = useAppStore((state) => state.updatePet);
  const deletePet = useAppStore((state) => state.deletePet);
  const selectedPetId = useAppStore((state) => state.selectedPetId);
  const setSelectedPetId = useAppStore((state) => state.setSelectedPetId);
  const weightUnit = useAppStore((state) => state.settings.weightUnit);

  const pet = pets.find((p) => p.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(pet?.name || '');
  const [breed, setBreed] = useState(pet?.breed || '');
  const [weight, setWeight] = useState(pet?.weight?.toString() || '15');
  const [ageYears, setAgeYears] = useState(pet?.ageYears?.toString() || '2');
  const [notes, setNotes] = useState(pet?.notes || '');
  const [microchipId, setMicrochipId] = useState(pet?.microchipId || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!pet) {
    return (
      <ScreenContainer>
        <AppHeader title="Pet Details" showBackButton />
        <View style={styles.center}>
          <AppText variant="body" color="secondary">
            Pet not found.
          </AppText>
        </View>
      </ScreenContainer>
    );
  }

  const isSelected = pet.id === selectedPetId;

  const handleSave = async () => {
    setIsSaving(true);
    await updatePet(pet.id, {
      name,
      breed,
      weight: parseFloat(weight) || pet.weight,
      ageYears: parseFloat(ageYears) || pet.ageYears,
      notes,
      microchipId: microchipId || undefined,
    });
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deletePet(pet.id);
    setIsDeleting(false);
    router.replace('/pets');
  };

  return (
    <ScreenContainer>
      <AppHeader
        title={pet.name}
        showBackButton
        rightElement={
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={[
              styles.editBtn,
              {
                backgroundColor: theme.colors.cardAlt,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <AppIcon
              name={isEditing ? 'close' : 'pencil'}
              size={18}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        }
        style={styles.header}
      />

      <AppScrollView contentContainerStyle={styles.content}>
        {/* Big Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: pet.photoUrl }} style={styles.largeAvatar} />
          {!isEditing && (
            <View style={styles.nameHeaderRow}>
              <AppText variant="h2">{pet.name}</AppText>
              <View
                style={[
                  styles.speciesBadge,
                  { backgroundColor: theme.colors.primaryUltraLight },
                ]}
              >
                <AppText variant="badge" color="brand">
                  {pet.species.toUpperCase()}
                </AppText>
              </View>
            </View>
          )}
          {!isEditing && (
            <AppText variant="subtitle" color="secondary">
              {pet.breed}
            </AppText>
          )}
        </View>

        {isEditing ? (
          /* Edit Form */
          <View style={styles.formContainer}>
            <AppInput
              label="Pet Name"
              value={name}
              onChangeText={setName}
            />
            <AppInput
              label="Breed"
              value={breed}
              onChangeText={setBreed}
            />
            <View style={styles.rowInputs}>
              <AppInput
                label="Age (Years)"
                value={ageYears}
                onChangeText={setAgeYears}
                keyboardType="numeric"
                containerStyle={styles.halfInput}
              />
              <AppInput
                label="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                containerStyle={styles.halfInput}
              />
            </View>
            <AppInput
              label="Microchip Number"
              value={microchipId}
              onChangeText={setMicrochipId}
            />
            <AppInput
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <AppButton
              title="Save Changes"
              onPress={handleSave}
              loading={isSaving}
              variant="primary"
              size="lg"
              style={styles.actionBtn}
            />
          </View>
        ) : (
          /* Profile Details */
          <View>
            {/* Quick stats cards */}
            <View style={styles.statsRow}>
              <AppCard style={styles.statBox} padding="sm">
                <AppText variant="caption" color="secondary">Age</AppText>
                <AppText variant="title">{pet.ageYears} yrs</AppText>
              </AppCard>
              <AppCard style={styles.statBox} padding="sm">
                <AppText variant="caption" color="secondary">Weight</AppText>
                <AppText variant="title">{formatWeight(pet.weight, weightUnit)}</AppText>
              </AppCard>
              <AppCard style={styles.statBox} padding="sm">
                <AppText variant="caption" color="secondary">Tracker</AppText>
                <AppText variant="captionBold" color="brand" numberOfLines={1}>
                  {pet.trackerDeviceId || 'Active'}
                </AppText>
              </AppCard>
            </View>

            {/* Set as Active Pet Button */}
            {!isSelected && (
              <AppButton
                title="Set as Active Pet"
                onPress={() => setSelectedPetId(pet.id)}
                variant="secondary"
                size="md"
                leftIcon="checkmark-circle-outline"
                style={styles.actionBtn}
              />
            )}

            {/* Identity & Device Info */}
            <AppCard style={styles.infoCard} padding="md">
              <AppText variant="title" style={styles.cardTitle}>
                Identity & Hardware
              </AppText>

              <View style={styles.infoRow}>
                <AppText variant="caption" color="secondary">Microchip ID</AppText>
                <AppText variant="bodyMedium">{pet.microchipId || 'Not registered'}</AppText>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

              <View style={styles.infoRow}>
                <AppText variant="caption" color="secondary">Tracker Hardware</AppText>
                <AppText variant="bodyMedium">{pet.trackerDeviceId || 'PULSE-TRK-771'}</AppText>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

              <View style={styles.infoRow}>
                <AppText variant="caption" color="secondary">Member Since</AppText>
                <AppText variant="bodyMedium">{formatDate(pet.createdAt)}</AppText>
              </View>
            </AppCard>

            {/* Medical Notes */}
            {pet.notes ? (
              <AppCard style={styles.infoCard} padding="md">
                <AppText variant="title" style={styles.cardTitle}>
                  Medical & Care Notes
                </AppText>
                <AppText variant="body" color="secondary">
                  {pet.notes}
                </AppText>
              </AppCard>
            ) : null}

            {/* Delete button (if more than 1 pet) */}
            {pets.length > 1 && (
              <AppButton
                title="Delete Pet"
                onPress={() => setIsDeleting(true)}
                variant="danger"
                size="md"
                leftIcon="trash-outline"
                style={styles.deleteBtn}
              />
            )}
          </View>
        )}
      </AppScrollView>

      <ConfirmDialog
        visible={isDeleting}
        title={`Delete ${pet.name}?`}
        message="Are you sure? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setIsDeleting(false)}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  largeAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
  },
  nameHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speciesBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  formContainer: {
    marginTop: 8,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  actionBtn: {
    marginVertical: 10,
  },
  infoCard: {
    marginTop: 12,
  },
  cardTitle: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  deleteBtn: {
    marginTop: 24,
  },
});
