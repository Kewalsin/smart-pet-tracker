import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storageKeys';

export const storageService = {
  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue !== null) {
        return JSON.parse(jsonValue) as T;
      }
      return defaultValue;
    } catch (e) {
      console.warn(`[storageService] Error reading key "${key}":`, e);
      return defaultValue;
    }
  },

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (e) {
      console.error(`[storageService] Error writing key "${key}":`, e);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`[storageService] Error removing key "${key}":`, e);
      return false;
    }
  },

  async clearAll(): Promise<boolean> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (e) {
      console.error('[storageService] Error clearing storage:', e);
      return false;
    }
  },
};
