import { create } from 'zustand';
import {
  Pet,
  CreatePetInput,
  UpdatePetInput,
  ActivityRecord,
  HealthRecord,
  Reminder,
  TrackerDevice,
  UserSettings,
} from '../types';
import {
  INITIAL_PETS,
  INITIAL_ACTIVITY_RECORDS,
  INITIAL_HEALTH_RECORDS,
  INITIAL_REMINDERS,
  INITIAL_TRACKER_DEVICES,
  DEFAULT_USER_SETTINGS,
} from '../constants/mockData';
import { storageService } from '../services/storage/storageService';
import { STORAGE_KEYS } from '../services/storage/storageKeys';

interface AppState {
  // State
  pets: Pet[];
  selectedPetId: string;
  activityRecords: ActivityRecord[];
  healthRecords: HealthRecord[];
  reminders: Reminder[];
  trackerDevices: Record<string, TrackerDevice>;
  settings: UserSettings;
  isLoading: boolean;
  isInitialized: boolean;

  // Lifecycle
  initializeStore: () => Promise<void>;
  resetToDemoData: () => Promise<void>;

  // Pets
  setSelectedPetId: (id: string) => void;
  addPet: (input: CreatePetInput) => Promise<Pet>;
  updatePet: (id: string, updates: UpdatePetInput) => Promise<boolean>;
  deletePet: (id: string) => Promise<boolean>;

  // Activity
  addActivityRecord: (record: Omit<ActivityRecord, 'id'>) => Promise<ActivityRecord>;

  // Health
  addHealthRecord: (record: Omit<HealthRecord, 'id' | 'createdAt'>) => Promise<HealthRecord>;
  updateHealthRecord: (id: string, updates: Partial<HealthRecord>) => Promise<boolean>;
  deleteHealthRecord: (id: string) => Promise<boolean>;

  // Reminders
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => Promise<Reminder>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<boolean>;
  deleteReminder: (id: string) => Promise<boolean>;
  toggleReminderComplete: (id: string) => Promise<boolean>;

  // Settings
  updateSettings: (updates: Partial<UserSettings>) => Promise<boolean>;
  toggleTheme: () => Promise<void>;

  // Tracker Devices
  updateTrackerBattery: (petId: string, level: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  pets: INITIAL_PETS,
  selectedPetId: INITIAL_PETS[0].id,
  activityRecords: INITIAL_ACTIVITY_RECORDS,
  healthRecords: INITIAL_HEALTH_RECORDS,
  reminders: INITIAL_REMINDERS,
  trackerDevices: INITIAL_TRACKER_DEVICES,
  settings: DEFAULT_USER_SETTINGS,
  isLoading: true,
  isInitialized: false,

  initializeStore: async () => {
    try {
      const initialized = await storageService.getItem<boolean>(STORAGE_KEYS.IS_INITIALIZED, false);

      if (!initialized) {
        // First run: seed mock data into storage
        await storageService.setItem(STORAGE_KEYS.PETS, INITIAL_PETS);
        await storageService.setItem(STORAGE_KEYS.SELECTED_PET_ID, INITIAL_PETS[0].id);
        await storageService.setItem(STORAGE_KEYS.ACTIVITY_RECORDS, INITIAL_ACTIVITY_RECORDS);
        await storageService.setItem(STORAGE_KEYS.HEALTH_RECORDS, INITIAL_HEALTH_RECORDS);
        await storageService.setItem(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS);
        await storageService.setItem(STORAGE_KEYS.TRACKER_DEVICES, INITIAL_TRACKER_DEVICES);
        await storageService.setItem(STORAGE_KEYS.SETTINGS, DEFAULT_USER_SETTINGS);
        await storageService.setItem(STORAGE_KEYS.IS_INITIALIZED, true);

        set({
          pets: INITIAL_PETS,
          selectedPetId: INITIAL_PETS[0].id,
          activityRecords: INITIAL_ACTIVITY_RECORDS,
          healthRecords: INITIAL_HEALTH_RECORDS,
          reminders: INITIAL_REMINDERS,
          trackerDevices: INITIAL_TRACKER_DEVICES,
          settings: DEFAULT_USER_SETTINGS,
          isLoading: false,
          isInitialized: true,
        });
      } else {
        // Load persistent data
        const savedPets = await storageService.getItem<Pet[]>(STORAGE_KEYS.PETS, INITIAL_PETS);
        const savedSelectedPetId = await storageService.getItem<string>(
          STORAGE_KEYS.SELECTED_PET_ID,
          savedPets[0]?.id || INITIAL_PETS[0].id
        );
        const savedActivities = await storageService.getItem<ActivityRecord[]>(
          STORAGE_KEYS.ACTIVITY_RECORDS,
          INITIAL_ACTIVITY_RECORDS
        );
        const savedHealth = await storageService.getItem<HealthRecord[]>(
          STORAGE_KEYS.HEALTH_RECORDS,
          INITIAL_HEALTH_RECORDS
        );
        const savedReminders = await storageService.getItem<Reminder[]>(
          STORAGE_KEYS.REMINDERS,
          INITIAL_REMINDERS
        );
        const savedTrackers = await storageService.getItem<Record<string, TrackerDevice>>(
          STORAGE_KEYS.TRACKER_DEVICES,
          INITIAL_TRACKER_DEVICES
        );
        const savedSettings = await storageService.getItem<UserSettings>(
          STORAGE_KEYS.SETTINGS,
          DEFAULT_USER_SETTINGS
        );

        set({
          pets: savedPets,
          selectedPetId: savedSelectedPetId,
          activityRecords: savedActivities,
          healthRecords: savedHealth,
          reminders: savedReminders,
          trackerDevices: savedTrackers,
          settings: savedSettings,
          isLoading: false,
          isInitialized: true,
        });
      }
    } catch (e) {
      console.error('[useAppStore] Error initializing store:', e);
      set({ isLoading: false, isInitialized: true });
    }
  },

  resetToDemoData: async () => {
    try {
      await storageService.setItem(STORAGE_KEYS.PETS, INITIAL_PETS);
      await storageService.setItem(STORAGE_KEYS.SELECTED_PET_ID, INITIAL_PETS[0].id);
      await storageService.setItem(STORAGE_KEYS.ACTIVITY_RECORDS, INITIAL_ACTIVITY_RECORDS);
      await storageService.setItem(STORAGE_KEYS.HEALTH_RECORDS, INITIAL_HEALTH_RECORDS);
      await storageService.setItem(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS);
      await storageService.setItem(STORAGE_KEYS.TRACKER_DEVICES, INITIAL_TRACKER_DEVICES);
      await storageService.setItem(STORAGE_KEYS.SETTINGS, DEFAULT_USER_SETTINGS);

      set({
        pets: INITIAL_PETS,
        selectedPetId: INITIAL_PETS[0].id,
        activityRecords: INITIAL_ACTIVITY_RECORDS,
        healthRecords: INITIAL_HEALTH_RECORDS,
        reminders: INITIAL_REMINDERS,
        trackerDevices: INITIAL_TRACKER_DEVICES,
        settings: DEFAULT_USER_SETTINGS,
      });
    } catch (e) {
      console.error('[useAppStore] Error resetting demo data:', e);
    }
  },

  setSelectedPetId: (id: string) => {
    set({ selectedPetId: id });
    storageService.setItem(STORAGE_KEYS.SELECTED_PET_ID, id);
  },

  addPet: async (input: CreatePetInput) => {
    const newPet: Pet = {
      ...input,
      id: `pet-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newDevice: TrackerDevice = {
      id: `dev-${newPet.id}`,
      petId: newPet.id,
      batteryLevel: 95,
      isCharging: false,
      isConnected: true,
      lastPing: Date.now(),
      signalStrength: 'excellent',
    };

    const updatedPets = [newPet, ...get().pets];
    const updatedDevices = { ...get().trackerDevices, [newPet.id]: newDevice };

    set({ pets: updatedPets, selectedPetId: newPet.id, trackerDevices: updatedDevices });
    await storageService.setItem(STORAGE_KEYS.PETS, updatedPets);
    await storageService.setItem(STORAGE_KEYS.SELECTED_PET_ID, newPet.id);
    await storageService.setItem(STORAGE_KEYS.TRACKER_DEVICES, updatedDevices);

    return newPet;
  },

  updatePet: async (id: string, updates: UpdatePetInput) => {
    const updatedPets = get().pets.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );

    set({ pets: updatedPets });
    await storageService.setItem(STORAGE_KEYS.PETS, updatedPets);
    return true;
  },

  deletePet: async (id: string) => {
    const remainingPets = get().pets.filter((p) => p.id !== id);
    if (remainingPets.length === 0) {
      // Keep at least one pet in portfolio demo
      return false;
    }

    const nextSelectedId = get().selectedPetId === id ? remainingPets[0].id : get().selectedPetId;

    set({ pets: remainingPets, selectedPetId: nextSelectedId });
    await storageService.setItem(STORAGE_KEYS.PETS, remainingPets);
    await storageService.setItem(STORAGE_KEYS.SELECTED_PET_ID, nextSelectedId);
    return true;
  },

  addActivityRecord: async (record) => {
    const newRecord: ActivityRecord = {
      ...record,
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };

    const updated = [newRecord, ...get().activityRecords];
    set({ activityRecords: updated });
    await storageService.setItem(STORAGE_KEYS.ACTIVITY_RECORDS, updated);
    return newRecord;
  },

  addHealthRecord: async (record) => {
    const newRecord: HealthRecord = {
      ...record,
      id: `hlth-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now(),
    };

    const updated = [newRecord, ...get().healthRecords];
    set({ healthRecords: updated });
    await storageService.setItem(STORAGE_KEYS.HEALTH_RECORDS, updated);
    return newRecord;
  },

  updateHealthRecord: async (id: string, updates: Partial<HealthRecord>) => {
    const updated = get().healthRecords.map((r) => (r.id === id ? { ...r, ...updates } : r));
    set({ healthRecords: updated });
    await storageService.setItem(STORAGE_KEYS.HEALTH_RECORDS, updated);
    return true;
  },

  deleteHealthRecord: async (id: string) => {
    const updated = get().healthRecords.filter((r) => r.id !== id);
    set({ healthRecords: updated });
    await storageService.setItem(STORAGE_KEYS.HEALTH_RECORDS, updated);
    return true;
  },

  addReminder: async (reminder) => {
    const newReminder: Reminder = {
      ...reminder,
      id: `rem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now(),
    };

    const updated = [newReminder, ...get().reminders];
    set({ reminders: updated });
    await storageService.setItem(STORAGE_KEYS.REMINDERS, updated);
    return newReminder;
  },

  updateReminder: async (id: string, updates: Partial<Reminder>) => {
    const updated = get().reminders.map((r) => (r.id === id ? { ...r, ...updates } : r));
    set({ reminders: updated });
    await storageService.setItem(STORAGE_KEYS.REMINDERS, updated);
    return true;
  },

  deleteReminder: async (id: string) => {
    const updated = get().reminders.filter((r) => r.id !== id);
    set({ reminders: updated });
    await storageService.setItem(STORAGE_KEYS.REMINDERS, updated);
    return true;
  },

  toggleReminderComplete: async (id: string) => {
    const updated = get().reminders.map((r) => {
      if (r.id === id) {
        const nextCompleted = !r.isCompleted;
        return {
          ...r,
          isCompleted: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined,
        };
      }
      return r;
    });

    set({ reminders: updated });
    await storageService.setItem(STORAGE_KEYS.REMINDERS, updated);
    return true;
  },

  updateSettings: async (updates: Partial<UserSettings>) => {
    const updatedSettings = { ...get().settings, ...updates };
    set({ settings: updatedSettings });
    await storageService.setItem(STORAGE_KEYS.SETTINGS, updatedSettings);
    return true;
  },

  toggleTheme: async () => {
    const current = get().settings.themePreference;
    const next = current === 'dark' ? 'light' : 'dark';
    await get().updateSettings({ themePreference: next });
  },

  updateTrackerBattery: (petId: string, level: number) => {
    const trackers = { ...get().trackerDevices };
    if (trackers[petId]) {
      trackers[petId] = {
        ...trackers[petId],
        batteryLevel: Math.max(0, Math.min(100, level)),
        lastPing: Date.now(),
      };
      set({ trackerDevices: trackers });
      storageService.setItem(STORAGE_KEYS.TRACKER_DEVICES, trackers);
    }
  },
}));
