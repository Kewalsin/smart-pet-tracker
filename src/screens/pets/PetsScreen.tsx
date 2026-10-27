import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppScrollView } from '../../components/layout/AppScrollView';
import { AppHeader } from '../../components/common/AppHeader';
import { AppButton } from '../../components/common/AppButton';
import { PetCard } from '../../components/pet/PetCard';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';

export const PetsScreen: React.FC = () => {
  const router = useRouter();
  const pets = useAppStore((state) => state.pets);
  const deletePet = useAppStore((state) => state.deletePet);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const targetPet = pets.find((p) => p.id === deleteTargetId);

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deletePet(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <ScreenContainer>
      <AppHeader
        title="My Pets"
        subtitle={`${pets.length} pet${pets.length === 1 ? '' : 's'} registered`}
        showBackButton
        rightElement={
          <AppButton
            title="Add Pet"
            onPress={() => router.push('/pets/add')}
            variant="primary"
            size="sm"
            leftIcon="add"
          />
        }
        style={styles.header}
      />

      <AppScrollView contentContainerStyle={styles.content}>
        {pets.length > 0 ? (
          pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onDelete={pets.length > 1 ? () => setDeleteTargetId(pet.id) : undefined}
            />
          ))
        ) : (
          <EmptyState
            title="No Pets Yet"
            description="Add your furry friend to start tracking activity, vaccinations, and GPS walks."
            actionTitle="Add New Pet"
            onActionPress={() => router.push('/pets/add')}
          />
        )}
      </AppScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        visible={!!deleteTargetId}
        title={`Delete ${targetPet?.name || 'Pet'}?`}
        message={`Are you sure you want to remove ${targetPet?.name || 'this pet'}? All linked activity and health logs will remain in local history.`}
        confirmText="Delete Pet"
        isDestructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
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
    paddingTop: 8,
  },
});
