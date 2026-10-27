import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { PetSpecies } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { AppIcon, IconName } from '../common/AppIcon';

interface PetAvatarProps {
  photoUrl?: string;
  species: PetSpecies;
  size?: number;
  isSelected?: boolean;
  style?: ViewStyle;
}

export const PetAvatar: React.FC<PetAvatarProps> = ({
  photoUrl,
  species,
  size = 56,
  isSelected = false,
  style,
}) => {
  const { theme } = useTheme();

  const getSpeciesIcon = (): IconName => {
    switch (species) {
      case 'cat':
        return 'paw';
      case 'dog':
      default:
        return 'paw';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          borderWidth: isSelected ? 3 : 1.5,
          backgroundColor: theme.colors.cardAlt,
        },
        style,
      ]}
    >
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={[styles.image, { width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }]}
          resizeMode="cover"
        />
      ) : (
        <AppIcon
          name={getSpeciesIcon()}
          size={size * 0.45}
          color={theme.colors.primary}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    overflow: 'hidden',
  },
});
