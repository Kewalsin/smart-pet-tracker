import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { useTheme } from '../../hooks/useTheme';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppScrollView } from '../../components/layout/AppScrollView';
import { AppHeader } from '../../components/common/AppHeader';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { AppText } from '../../components/common/AppText';
import { PetSpecies } from '../../types';
import { validatePetForm } from '../../utils/validation';

const SPECIES_OPTIONS: { label: string; value: PetSpecies; icon: string }[] = [
  { label: 'Dog', value: 'dog', icon: '🐕' },
  { label: 'Cat', value: 'cat', icon: '🐈' },
  { label: 'Bird', value: 'bird', icon: '🦜' },
  { label: 'Rabbit', value: 'rabbit', icon: '🐇' },
  { label: 'Other', value: 'other', icon: '🐾' },
];

const PRESET_PHOTOS = [
  { label: 'Golden', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Siamese', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80' },
  { label: 'Frenchie', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Beagle', url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80' },
  { label: 'Tabby', url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80' },
];

export const AddPetScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const addPet = useAppStore((state) => state.addPet);

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [ageYears, setAgeYears] = useState('2');
  const [weight, setWeight] = useState('15');
  const [photoUrl, setPhotoUrl] = useState(PRESET_PHOTOS[0].url);
  const [notes, setNotes] = useState('');
  const [microchipId, setMicrochipId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const input = {
      name,
      species,
      breed,
      birthDate: new Date().toISOString().split('T')[0],
      ageYears: parseFloat(ageYears) || 1,
      weight: parseFloat(weight) || 10,
      photoUrl,
      notes,
      microchipId: microchipId || undefined,
      trackerDeviceId: `PULSE-TRK-${Math.floor(100 + Math.random() * 900)}`,
    };

    const validation = validatePetForm(input);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await addPet(input);
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <AppHeader title="Add New Pet" showBackButton style={styles.header} />

      <AppScrollView contentContainerStyle={styles.content}>
        {/* Photo Selection Preview */}
        <View style={styles.photoSection}>
          <Image source={{ uri: photoUrl }} style={styles.previewImage} />
          <AppText variant="captionBold" color="secondary" style={styles.photoLabel}>
            Choose Profile Avatar:
          </AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarRow}>
            {PRESET_PHOTOS.map((preset, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setPhotoUrl(preset.url)}
                style={[
                  styles.thumbnailWrapper,
                  photoUrl === preset.url && { borderColor: theme.colors.primary, borderWidth: 2.5 },
                ]}
              >
                <Image source={{ uri: preset.url }} style={styles.thumbImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Species Picker */}
        <View style={styles.speciesContainer}>
          <AppText variant="captionBold" color="secondary" style={styles.label}>
            Pet Species *
          </AppText>
          <View style={styles.speciesRow}>
            {SPECIES_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setSpecies(opt.value)}
                style={[
                  styles.speciesChip,
                  {
                    backgroundColor: species === opt.value ? theme.colors.primaryUltraLight : theme.colors.card,
                    borderColor: species === opt.value ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                <AppText style={styles.speciesEmoji}>{opt.icon}</AppText>
                <AppText
                  variant="captionBold"
                  color={species === opt.value ? 'brand' : 'secondary'}
                >
                  {opt.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form Inputs */}
        <AppInput
          label="Pet Name *"
          placeholder="e.g. Bella"
          value={name}
          onChangeText={(v) => {
            setName(v);
            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
          }}
          error={errors.name}
          leftIcon="paw-outline"
        />

        <AppInput
          label="Breed *"
          placeholder="e.g. Golden Retriever"
          value={breed}
          onChangeText={(v) => {
            setBreed(v);
            if (errors.breed) setErrors((prev) => ({ ...prev, breed: '' }));
          }}
          error={errors.breed}
          leftIcon="finger-print-outline"
        />

        <View style={styles.rowInputs}>
          <AppInput
            label="Age (Years) *"
            placeholder="e.g. 3"
            value={ageYears}
            onChangeText={setAgeYears}
            keyboardType="numeric"
            containerStyle={styles.halfInput}
            error={errors.ageYears}
          />
          <AppInput
            label="Weight (kg) *"
            placeholder="e.g. 28.5"
            value={weight}
            onChangeText={(v) => {
              setWeight(v);
              if (errors.weight) setErrors((prev) => ({ ...prev, weight: '' }));
            }}
            keyboardType="numeric"
            containerStyle={styles.halfInput}
            error={errors.weight}
          />
        </View>

        <AppInput
          label="Microchip Number (Optional)"
          placeholder="e.g. 985-141-002-345-678"
          value={microchipId}
          onChangeText={setMicrochipId}
          leftIcon="barcode-outline"
        />

        <AppInput
          label="Special Notes or Allergies"
          placeholder="e.g. Friendly, loves water, mild chicken allergy."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        <AppButton
          title="Save Pet"
          onPress={handleSave}
          loading={loading}
          variant="primary"
          size="lg"
          style={styles.saveButton}
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
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  photoLabel: {
    marginBottom: 8,
  },
  avatarRow: {
    gap: 10,
    paddingHorizontal: 4,
  },
  thumbnailWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  speciesContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  speciesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  speciesChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  speciesEmoji: {
    fontSize: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  saveButton: {
    marginTop: 16,
  },
});
