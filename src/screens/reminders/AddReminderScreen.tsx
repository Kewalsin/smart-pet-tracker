import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { useTheme } from '../../hooks/useTheme';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppScrollView } from '../../components/layout/AppScrollView';
import { AppHeader } from '../../components/common/AppHeader';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { AppText } from '../../components/common/AppText';
import { ReminderCategory } from '../../types';
import { validateReminderForm } from '../../utils/validation';

const CATEGORIES: { label: string; value: ReminderCategory; icon: string }[] = [
  { label: 'Walk & Play', value: 'walk', icon: '🐕' },
  { label: 'Medication', value: 'medication', icon: '💊' },
  { label: 'Feeding', value: 'feeding', icon: '🍲' },
  { label: 'Vet Visit', value: 'vet', icon: '🩺' },
  { label: 'Grooming', value: 'grooming', icon: '✂️' },
  { label: 'Other', value: 'other', icon: '📌' },
];

export const AddReminderScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const pets = useAppStore((state) => state.pets);
  const selectedPetId = useAppStore((state) => state.selectedPetId);
  const addReminder = useAppStore((state) => state.addReminder);

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReminderCategory>('walk');
  const [dateTime, setDateTime] = useState(() =>
    new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString()
  );
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const input = {
      petId: activePet.id,
      title,
      category,
      dateTime,
      isCompleted: false,
      repeat,
      notes,
    };

    const validation = validateReminderForm(input);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await addReminder(input);
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <AppHeader
        title="New Reminder"
        subtitle={activePet ? `For ${activePet.name}` : undefined}
        showBackButton
        style={styles.header}
      />

      <AppScrollView contentContainerStyle={styles.content}>
        {/* Category Picker */}
        <AppText variant="captionBold" color="secondary" style={styles.label}>
          Reminder Category *
        </AppText>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              onPress={() => setCategory(cat.value)}
              style={[
                styles.categoryCard,
                {
                  backgroundColor:
                    category === cat.value
                      ? theme.colors.primaryUltraLight
                      : theme.colors.card,
                  borderColor:
                    category === cat.value
                      ? theme.colors.primary
                      : theme.colors.border,
                },
              ]}
            >
              <AppText style={styles.categoryEmoji}>{cat.icon}</AppText>
              <AppText
                variant="captionBold"
                color={category === cat.value ? 'brand' : 'secondary'}
              >
                {cat.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Inputs */}
        <AppInput
          label="Reminder Title *"
          placeholder="e.g. Evening Walk & Fetch"
          value={title}
          onChangeText={(v) => {
            setTitle(v);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          error={errors.title}
          leftIcon="notifications-outline"
        />

        <AppInput
          label="Schedule (ISO DateTime) *"
          placeholder="YYYY-MM-DDTHH:MM:SSZ"
          value={dateTime}
          onChangeText={(v) => {
            setDateTime(v);
            if (errors.dateTime) setErrors((prev) => ({ ...prev, dateTime: '' }));
          }}
          error={errors.dateTime}
          leftIcon="calendar-outline"
        />

        {/* Repeat Selector */}
        <AppText variant="captionBold" color="secondary" style={styles.label}>
          Repeat
        </AppText>
        <View style={styles.repeatRow}>
          {(['none', 'daily', 'weekly', 'monthly'] as const).map((rep) => (
            <TouchableOpacity
              key={rep}
              onPress={() => setRepeat(rep)}
              style={[
                styles.repeatBtn,
                {
                  backgroundColor:
                    repeat === rep
                      ? theme.colors.primaryUltraLight
                      : theme.colors.card,
                  borderColor:
                    repeat === rep
                      ? theme.colors.primary
                      : theme.colors.border,
                },
              ]}
            >
              <AppText
                variant="captionBold"
                color={repeat === rep ? 'brand' : 'secondary'}
              >
                {rep.toUpperCase()}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        <AppInput
          label="Notes (Optional)"
          placeholder="e.g. Bring water bottle, give pill with dinner"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          containerStyle={{ marginTop: 12 }}
        />

        <AppButton
          title="Save Reminder"
          onPress={handleSave}
          loading={loading}
          variant="primary"
          size="lg"
          style={styles.saveBtn}
        />
      </AppScrollView>
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
  label: {
    marginBottom: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  repeatRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  repeatBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  saveBtn: {
    marginTop: 20,
  },
});
