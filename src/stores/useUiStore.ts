import { create } from 'zustand';
import { UserRole, SizeFilter, ToastMessage } from '../types';

interface UiState {
  currentRole: UserRole;
  sizeFilter: SizeFilter;
  selectedSkateId: string | null;
  toasts: ToastMessage[];
  showRentalModal: boolean;
  setCurrentRole: (role: UserRole) => void;
  setSizeFilter: (size: SizeFilter) => void;
  setSelectedSkateId: (id: string | null) => void;
  setShowRentalModal: (show: boolean) => void;
  addToast: (type: ToastMessage['type'], message: string) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  currentRole: UserRole.ADMIN,
  sizeFilter: 'all',
  selectedSkateId: null,
  toasts: [],
  showRentalModal: false,

  setCurrentRole: (role) => set({ currentRole: role }),

  setSizeFilter: (size) => set({ sizeFilter: size }),

  setSelectedSkateId: (id) => set({ selectedSkateId: id }),

  setShowRentalModal: (show) => set({ showRentalModal: show }),

  addToast: (type, message) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastMessage = { id, type, message };
    set({ toasts: [...get().toasts, toast] });

    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter(t => t.id !== id) });
  },

  clearToasts: () => set({ toasts: [] })
}));
