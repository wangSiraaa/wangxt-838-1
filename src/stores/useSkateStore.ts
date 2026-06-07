import { create } from 'zustand';
import { Skate, SkateStatus, InventoryStats, SizeStats } from '../types';
import { getSkates, saveSkates, isInitialized, markInitialized } from '../utils/storage';
import { generateMockSkates, generateId } from '../utils/mockData';
import { SIZE_OPTIONS } from '../utils/constants';

interface SkateState {
  skates: Skate[];
  loading: boolean;
  initialized: boolean;
  initData: () => void;
  addSkate: (skate: Omit<Skate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSkate: (id: string, updates: Partial<Skate>) => void;
  updateSkateStatus: (id: string, status: SkateStatus) => void;
  deleteSkate: (id: string) => void;
  getSkateById: (id: string) => Skate | undefined;
  getStats: () => InventoryStats;
  getSizeStats: () => SizeStats[];
  getSkatesBySize: (size: number | 'all') => Skate[];
}

export const useSkateStore = create<SkateState>((set, get) => ({
  skates: [],
  loading: false,
  initialized: false,

  initData: () => {
    if (!isInitialized()) {
      const mockSkates = generateMockSkates();
      saveSkates(mockSkates);
      markInitialized();
      set({ skates: mockSkates, initialized: true });
    } else {
      const savedSkates = getSkates();
      set({ skates: savedSkates, initialized: true });
    }
  },

  addSkate: (skateData) => {
    const now = new Date().toISOString();
    const newSkate: Skate = {
      ...skateData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    const newSkates = [...get().skates, newSkate];
    saveSkates(newSkates);
    set({ skates: newSkates });
  },

  updateSkate: (id, updates) => {
    const now = new Date().toISOString();
    const newSkates = get().skates.map(skate =>
      skate.id === id ? { ...skate, ...updates, updatedAt: now } : skate
    );
    saveSkates(newSkates);
    set({ skates: newSkates });
  },

  updateSkateStatus: (id, status) => {
    get().updateSkate(id, { status });
  },

  deleteSkate: (id) => {
    const newSkates = get().skates.filter(skate => skate.id !== id);
    saveSkates(newSkates);
    set({ skates: newSkates });
  },

  getSkateById: (id) => {
    return get().skates.find(skate => skate.id === id);
  },

  getStats: () => {
    const skates = get().skates;
    return {
      total: skates.length,
      available: skates.filter(s => s.status === SkateStatus.AVAILABLE).length,
      rented: skates.filter(s => s.status === SkateStatus.RENTED).length,
      disinfecting: skates.filter(s => s.status === SkateStatus.DISINFECTING).length
    };
  },

  getSizeStats: () => {
    const skates = get().skates;
    return SIZE_OPTIONS.map(size => {
      const sizeSkates = skates.filter(s => s.size === size);
      return {
        size,
        total: sizeSkates.length,
        available: sizeSkates.filter(s => s.status === SkateStatus.AVAILABLE).length,
        rented: sizeSkates.filter(s => s.status === SkateStatus.RENTED).length,
        disinfecting: sizeSkates.filter(s => s.status === SkateStatus.DISINFECTING).length
      };
    });
  },

  getSkatesBySize: (size) => {
    if (size === 'all') {
      return get().skates;
    }
    return get().skates.filter(s => s.size === size);
  }
}));
