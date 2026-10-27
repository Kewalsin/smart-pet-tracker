import {
  validatePetForm,
  validateHealthRecordForm,
  validateReminderForm,
} from '../src/utils/validation';

describe('Validation Utility Tests', () => {
  describe('Pet Form Validation', () => {
    it('validates valid pet payload successfully', () => {
      const result = validatePetForm({
        name: 'Bella',
        species: 'dog',
        breed: 'Golden Retriever',
        weight: 28.5,
        ageYears: 3,
      });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('rejects empty pet name', () => {
      const result = validatePetForm({
        name: ' ',
        species: 'dog',
        breed: 'Golden Retriever',
        weight: 28.5,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });

    it('rejects negative or zero weight', () => {
      const result = validatePetForm({
        name: 'Bella',
        species: 'dog',
        breed: 'Golden Retriever',
        weight: -5,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.weight).toBeDefined();
    });

    it('rejects missing breed', () => {
      const result = validatePetForm({
        name: 'Bella',
        species: 'dog',
        breed: '',
        weight: 12,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.breed).toBeDefined();
    });
  });

  describe('Health Record Form Validation', () => {
    it('validates a valid vaccination log', () => {
      const result = validateHealthRecordForm({
        title: 'Rabies Booster',
        type: 'vaccination',
        date: '2026-10-26',
        vaccineName: 'Defensor 3',
      });
      expect(result.isValid).toBe(true);
    });

    it('flags missing vaccine name for vaccination record', () => {
      const result = validateHealthRecordForm({
        title: 'Annual Shot',
        type: 'vaccination',
        date: '2026-10-26',
        vaccineName: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.vaccineName).toBeDefined();
    });

    it('flags missing weight for weight record', () => {
      const result = validateHealthRecordForm({
        title: 'Weigh In',
        type: 'weight',
        date: '2026-10-26',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.weightValue).toBeDefined();
    });
  });

  describe('Reminder Form Validation', () => {
    it('validates a valid reminder', () => {
      const result = validateReminderForm({
        title: 'Evening Walk',
        category: 'walk',
        dateTime: '2026-10-26T18:00:00Z',
      });
      expect(result.isValid).toBe(true);
    });

    it('rejects missing title or date', () => {
      const result = validateReminderForm({
        title: '',
        category: 'walk',
        dateTime: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
      expect(result.errors.dateTime).toBeDefined();
    });
  });
});
