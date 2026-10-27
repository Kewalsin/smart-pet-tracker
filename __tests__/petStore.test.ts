import { useAppStore } from '../src/store';
import { CreatePetInput } from '../src/types';

describe('App Store Unit Tests', () => {
  beforeEach(async () => {
    await useAppStore.getState().resetToDemoData();
  });

  describe('Pet CRUD Operations', () => {
    it('creates a new pet and sets as selected', async () => {
      const initialCount = useAppStore.getState().pets.length;
      const newPetInput: CreatePetInput = {
        name: 'Rocky',
        species: 'dog',
        breed: 'Border Collie',
        birthDate: '2023-01-01',
        ageYears: 3,
        weight: 18.0,
        photoUrl: 'https://example.com/rocky.jpg',
        notes: 'Very smart herding dog',
      };

      const added = await useAppStore.getState().addPet(newPetInput);

      expect(added.id).toBeDefined();
      expect(added.name).toBe('Rocky');
      expect(useAppStore.getState().pets.length).toBe(initialCount + 1);
      expect(useAppStore.getState().selectedPetId).toBe(added.id);
    });

    it('updates an existing pet profile', async () => {
      const pet = useAppStore.getState().pets[0];
      const success = await useAppStore.getState().updatePet(pet.id, {
        weight: 29.5,
        notes: 'Updated weight after diet check',
      });

      expect(success).toBe(true);
      const updatedPet = useAppStore.getState().pets.find((p) => p.id === pet.id);
      expect(updatedPet?.weight).toBe(29.5);
      expect(updatedPet?.notes).toBe('Updated weight after diet check');
    });

    it('deletes a pet properly', async () => {
      const pets = useAppStore.getState().pets;
      const targetPet = pets[pets.length - 1];
      const initialLength = pets.length;

      const success = await useAppStore.getState().deletePet(targetPet.id);
      expect(success).toBe(true);
      expect(useAppStore.getState().pets.length).toBe(initialLength - 1);
      expect(useAppStore.getState().pets.some((p) => p.id === targetPet.id)).toBe(false);
    });
  });

  describe('Reminder Management', () => {
    it('toggles reminder completion status', async () => {
      const reminder = useAppStore.getState().reminders[0];
      const initialStatus = reminder.isCompleted;

      await useAppStore.getState().toggleReminderComplete(reminder.id);
      const updated = useAppStore.getState().reminders.find((r) => r.id === reminder.id);

      expect(updated?.isCompleted).toBe(!initialStatus);
    });
  });

  describe('Settings Preferences', () => {
    it('updates distance and weight units', async () => {
      await useAppStore.getState().updateSettings({
        distanceUnit: 'mi',
        weightUnit: 'lbs',
      });

      expect(useAppStore.getState().settings.distanceUnit).toBe('mi');
      expect(useAppStore.getState().settings.weightUnit).toBe('lbs');
    });

    it('toggles theme preference between light and dark', async () => {
      await useAppStore.getState().updateSettings({ themePreference: 'light' });
      await useAppStore.getState().toggleTheme();
      expect(useAppStore.getState().settings.themePreference).toBe('dark');
    });
  });
});
