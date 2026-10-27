import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { useTheme } from '../../hooks/useTheme';
import { PetAvatar } from './PetAvatar';
import { AppText } from '../common/AppText';
import { AppIcon } from '../common/AppIcon';

export const PetSelector: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const pets = useAppStore((state) => state.pets);
  const selectedPetId = useAppStore((state) => state.selectedPetId);
  const setSelectedPetId = useAppStore((state) => state.setSelectedPetId);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {pets.map((pet) => {
          const isSelected = pet.id === selectedPetId;
          return (
            <TouchableOpacity
              key={pet.id}
              onPress={() => setSelectedPetId(pet.id)}
              style={styles.petItem}
              activeOpacity={0.8}
            >
              <PetAvatar
                photoUrl={pet.photoUrl}
                species={pet.species}
                size={58}
                isSelected={isSelected}
              />
              <AppText
                variant={isSelected ? 'captionBold' : 'caption'}
                color={isSelected ? 'brand' : 'secondary'}
                style={styles.name}
                numberOfLines={1}
              >
                {pet.name}
              </AppText>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          onPress={() => router.push('/pets/add')}
          style={styles.addItem}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.addIconCircle,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.cardAlt,
              },
            ]}
          >
            <AppIcon name="add" size={24} color={theme.colors.primary} />
          </View>
          <AppText variant="caption" color="secondary" style={styles.name}>
            Add Pet
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 16,
    alignItems: 'center',
  },
  petItem: {
    alignItems: 'center',
    width: 68,
  },
  addItem: {
    alignItems: 'center',
    width: 68,
  },
  name: {
    marginTop: 6,
    textAlign: 'center',
  },
  addIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
