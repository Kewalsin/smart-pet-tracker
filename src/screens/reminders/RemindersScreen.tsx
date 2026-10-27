import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { useTheme } from '../../hooks/useTheme';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppScrollView } from '../../components/layout/AppScrollView';
import { AppHeader } from '../../components/common/AppHeader';
import { AppButton } from '../../components/common/AppButton';
import { AppText } from '../../components/common/AppText';
import { PetSelector } from '../../components/pet/PetSelector';
import { ReminderItem } from '../../components/reminders/ReminderItem';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';

export const RemindersScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const pets = useAppStore((state) => state.pets);
  const selectedPetId = useAppStore((state) => state.selectedPetId);
  const reminders = useAppStore((state) => state.reminders);
  const toggleReminderComplete = useAppStore((state) => state.toggleReminderComplete);
  const deleteReminder = useAppStore((state) => state.deleteReminder);

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const petReminders = reminders.filter((r) => r.petId === activePet?.id);
  const displayReminders = petReminders.filter((r) =>
    activeTab === 'pending' ? !r.isCompleted : r.isCompleted
  );

  const handleDelete = async () => {
    if (deleteTargetId) {
      await deleteReminder(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <ScreenContainer>
      <AppHeader
        title="Reminders"
        subtitle={activePet ? `Tasks for ${activePet.name}` : undefined}
        showBackButton
        rightElement={
          <AppButton
            title="Add"
            onPress={() => router.push('/reminders/add')}
            variant="primary"
            size="sm"
            leftIcon="add"
          />
        }
        style={styles.header}
      />

      <AppScrollView contentContainerStyle={styles.content}>
        {/* Pet Switcher */}
        <PetSelector />

        {/* Pending vs Completed Tabs */}
        <View
          style={[
            styles.tabContainer,
            {
              backgroundColor: theme.colors.cardAlt,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('pending')}
            style={[
              styles.tabBtn,
              activeTab === 'pending' && {
                backgroundColor: theme.colors.card,
                ...theme.shadows.sm,
              },
            ]}
          >
            <AppText
              variant="captionBold"
              color={activeTab === 'pending' ? 'brand' : 'secondary'}
            >
              Upcoming ({petReminders.filter((r) => !r.isCompleted).length})
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('completed')}
            style={[
              styles.tabBtn,
              activeTab === 'completed' && {
                backgroundColor: theme.colors.card,
                ...theme.shadows.sm,
              },
            ]}
          >
            <AppText
              variant="captionBold"
              color={activeTab === 'completed' ? 'brand' : 'secondary'}
            >
              Completed ({petReminders.filter((r) => r.isCompleted).length})
            </AppText>
          </TouchableOpacity>
        </View>

        {/* List of Reminders */}
        {displayReminders.length > 0 ? (
          displayReminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              onToggleComplete={() => toggleReminderComplete(reminder.id)}
              onDelete={() => setDeleteTargetId(reminder.id)}
            />
          ))
        ) : (
          <EmptyState
            icon="alarm-outline"
            title={activeTab === 'pending' ? 'All Caught Up!' : 'No Completed Tasks'}
            description={
              activeTab === 'pending'
                ? `No pending reminders for ${activePet?.name}. Stay on top of walks, feeding, and meds!`
                : 'Completed reminders will appear here for your records.'
            }
            actionTitle={activeTab === 'pending' ? 'Create Reminder' : undefined}
            onActionPress={activeTab === 'pending' ? () => router.push('/reminders/add') : undefined}
          />
        )}
      </AppScrollView>

      {/* Delete Confirmation */}
      <ConfirmDialog
        visible={!!deleteTargetId}
        title="Delete Reminder?"
        message="Are you sure you want to remove this reminder? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        onConfirm={handleDelete}
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
    paddingBottom: 48,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
});
