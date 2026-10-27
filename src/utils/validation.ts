import { CreatePetInput, HealthRecord, Reminder } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validatePetForm = (data: Partial<CreatePetInput>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Pet name is required.';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!data.species) {
    errors.species = 'Please select a species.';
  }

  if (!data.breed || !data.breed.trim()) {
    errors.breed = 'Breed is required.';
  }

  if (data.weight === undefined || isNaN(data.weight) || data.weight <= 0) {
    errors.weight = 'Weight must be a positive number.';
  } else if (data.weight > 200) {
    errors.weight = 'Weight cannot exceed 200 kg.';
  }

  if (data.ageYears !== undefined && (isNaN(data.ageYears) || data.ageYears < 0 || data.ageYears > 50)) {
    errors.ageYears = 'Please enter a valid age between 0 and 50.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateHealthRecordForm = (data: Partial<HealthRecord>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Title or description is required.';
  }

  if (!data.type) {
    errors.type = 'Record category is required.';
  }

  if (!data.date || !data.date.trim()) {
    errors.date = 'Date is required.';
  }

  if (data.type === 'weight') {
    if (data.weightValue === undefined || isNaN(data.weightValue) || data.weightValue <= 0) {
      errors.weightValue = 'Please enter a valid weight in kg.';
    }
  }

  if (data.type === 'vaccination') {
    if (!data.vaccineName || !data.vaccineName.trim()) {
      errors.vaccineName = 'Vaccine name is required.';
    }
  }

  if (data.type === 'medication') {
    if (!data.medicationName || !data.medicationName.trim()) {
      errors.medicationName = 'Medication name is required.';
    }
    if (!data.dosage || !data.dosage.trim()) {
      errors.dosage = 'Dosage instructions are required.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateReminderForm = (data: Partial<Reminder>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Reminder title is required.';
  }

  if (!data.category) {
    errors.category = 'Category is required.';
  }

  if (!data.dateTime || !data.dateTime.trim()) {
    errors.dateTime = 'Date and time are required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
