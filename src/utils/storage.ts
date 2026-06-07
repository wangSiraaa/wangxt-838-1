import { Skate, RentalOrder } from '../types';
import { STORAGE_KEYS } from './constants';

export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

export function getSkates(): Skate[] {
  return getFromStorage<Skate[]>(STORAGE_KEYS.SKATES, []);
}

export function saveSkates(skates: Skate[]): void {
  setToStorage(STORAGE_KEYS.SKATES, skates);
}

export function getRentals(): RentalOrder[] {
  return getFromStorage<RentalOrder[]>(STORAGE_KEYS.RENTALS, []);
}

export function saveRentals(rentals: RentalOrder[]): void {
  setToStorage(STORAGE_KEYS.RENTALS, rentals);
}

export function isInitialized(): boolean {
  return getFromStorage<boolean>(STORAGE_KEYS.INITIALIZED, false);
}

export function markInitialized(): void {
  setToStorage(STORAGE_KEYS.INITIALIZED, true);
}

export function clearAllData(): void {
  removeFromStorage(STORAGE_KEYS.SKATES);
  removeFromStorage(STORAGE_KEYS.RENTALS);
  removeFromStorage(STORAGE_KEYS.INITIALIZED);
}
