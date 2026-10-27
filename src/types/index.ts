export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  birthDate: string; // ISO date YYYY-MM-DD
  ageYears: number;
  weight: number; // Stored consistently in kg
  photoUrl: string;
  notes: string;
  microchipId?: string;
  trackerDeviceId?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreatePetInput = Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePetInput = Partial<CreatePetInput>;

export interface ActivityRecord {
  id: string;
  petId: string;
  date: string; // YYYY-MM-DD
  steps: number;
  distanceKm: number;
  activeMinutes: number;
  calories: number;
  restingMinutes: number;
  hourlySteps?: number[]; // 24-element array
}

export type ActivityFilterPeriod = 'day' | 'week' | 'month';

export interface Coordinate {
  latitude: number;
  longitude: number;
  timestamp: number;
  speedKmh?: number;
}

export type TrackingStatus = 'idle' | 'tracking' | 'paused' | 'stopped';

export interface TrackingSession {
  id: string;
  petId: string;
  startTime: number;
  endTime?: number;
  durationSeconds: number;
  coordinates: Coordinate[];
  totalDistanceKm: number;
  averageSpeedKmh: number;
  currentSpeedKmh: number;
  status: TrackingStatus;
  isSimulation: boolean;
}

export type TrackerSignal = 'excellent' | 'good' | 'fair' | 'poor';

export interface TrackerDevice {
  id: string;
  petId: string;
  batteryLevel: number; // 0 - 100
  isCharging: boolean;
  isConnected: boolean;
  lastPing: number;
  signalStrength: TrackerSignal;
}

export type HealthRecordType = 'weight' | 'vaccination' | 'medication' | 'vet_visit' | 'observation';

export interface HealthRecord {
  id: string;
  petId: string;
  type: HealthRecordType;
  date: string; // YYYY-MM-DD
  title: string;
  notes?: string;
  // Specific fields based on type
  weightValue?: number; // kg
  vaccineName?: string;
  nextDueDate?: string;
  clinicName?: string;
  medicationName?: string;
  dosage?: string;
  frequency?: string;
  isOngoing?: boolean;
  vetName?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  isSampleData?: boolean;
  createdAt: number;
}

export type ReminderCategory = 'feeding' | 'medication' | 'walk' | 'vet' | 'grooming' | 'other';

export interface Reminder {
  id: string;
  petId: string;
  title: string;
  category: ReminderCategory;
  dateTime: string; // ISO datetime string
  isCompleted: boolean;
  completedAt?: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  notes?: string;
  createdAt: number;
}

export type DistanceUnit = 'km' | 'mi';
export type WeightUnit = 'kg' | 'lbs';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface UserSettings {
  themePreference: ThemePreference;
  distanceUnit: DistanceUnit;
  weightUnit: WeightUnit;
  notificationsEnabled: boolean;
  liveTrackingSimulationSpeed: number; // 1x, 2x, etc.
}
