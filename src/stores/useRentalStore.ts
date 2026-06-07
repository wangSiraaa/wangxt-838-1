import { create } from 'zustand';
import { RentalOrder, RentalStatus, SkateStatus } from '../types';
import { getRentals, saveRentals } from '../utils/storage';
import { generateMockRentals, generateId, generateOrderNo } from '../utils/mockData';
import { validateRentalSubmission } from '../utils/validator';
import { useSkateStore } from './useSkateStore';

interface RentalState {
  rentals: RentalOrder[];
  loading: boolean;
  initData: (skates?: any[]) => void;
  createRental: (data: {
    skateId: string;
    phone: string;
    customerName: string;
  }) => { success: boolean; message?: string; order?: RentalOrder };
  returnRental: (rentalId: string) => { success: boolean; message?: string };
  cancelRental: (rentalId: string) => { success: boolean; message?: string };
  getRentalById: (id: string) => RentalOrder | undefined;
  getRentalsByPhone: (phone: string) => RentalOrder[];
  getRentalsByStatus: (status: RentalStatus) => RentalOrder[];
  getActiveRentals: () => RentalOrder[];
  getStats: () => { total: number; renting: number; returned: number; cancelled: number };
  resetData: () => void;
}

export const useRentalStore = create<RentalState>((set, get) => ({
  rentals: [],
  loading: false,

  initData: (skates) => {
    const savedRentals = getRentals();
    if (savedRentals.length === 0 && skates && skates.length > 0) {
      const mockRentals = generateMockRentals(skates);
      saveRentals(mockRentals);
      set({ rentals: mockRentals });
    } else {
      set({ rentals: savedRentals });
    }
  },

  getStats: () => {
    const rentals = get().rentals;
    return {
      total: rentals.length,
      renting: rentals.filter(r => r.status === RentalStatus.RENTING).length,
      returned: rentals.filter(r => r.status === RentalStatus.RETURNED).length,
      cancelled: rentals.filter(r => r.status === RentalStatus.CANCELLED).length
    };
  },

  createRental: ({ skateId, phone, customerName }) => {
    const skate = useSkateStore.getState().getSkateById(skateId);
    if (!skate) {
      return { success: false, message: '冰鞋不存在' };
    }

    const validation = validateRentalSubmission(
      skate,
      phone,
      customerName,
      get().rentals
    );
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    const now = new Date().toISOString();
    const expectedReturn = new Date();
    expectedReturn.setDate(expectedReturn.getDate() + 1);

    const newOrder: RentalOrder = {
      id: generateId(),
      orderNo: generateOrderNo(),
      skateId,
      phone,
      customerName,
      rentTime: now,
      expectedReturnTime: expectedReturn.toISOString(),
      status: RentalStatus.RENTING,
      createdAt: now,
      updatedAt: now
    };

    const newRentals = [...get().rentals, newOrder];
    saveRentals(newRentals);
    set({ rentals: newRentals });

    useSkateStore.getState().updateSkateStatus(skateId, SkateStatus.RENTED);

    return { success: true, order: newOrder };
  },

  returnRental: (rentalId) => {
    const rental = get().getRentalById(rentalId);
    if (!rental) {
      return { success: false, message: '租借单不存在' };
    }
    if (rental.status !== RentalStatus.RENTING) {
      return { success: false, message: '该租借单不可归还' };
    }

    const now = new Date().toISOString();
    const newRentals = get().rentals.map(r =>
      r.id === rentalId
        ? { ...r, status: RentalStatus.RETURNED, actualReturnTime: now, updatedAt: now }
        : r
    );
    saveRentals(newRentals);
    set({ rentals: newRentals });

    useSkateStore.getState().updateSkateStatus(rental.skateId, SkateStatus.DISINFECTING);

    return { success: true, message: '归还成功，冰鞋已进入消毒流程' };
  },

  cancelRental: (rentalId) => {
    const rental = get().getRentalById(rentalId);
    if (!rental) {
      return { success: false, message: '租借单不存在' };
    }
    if (rental.status !== RentalStatus.RENTING) {
      return { success: false, message: '该租借单不可取消' };
    }

    const now = new Date().toISOString();
    const newRentals = get().rentals.map(r =>
      r.id === rentalId
        ? { ...r, status: RentalStatus.CANCELLED, updatedAt: now }
        : r
    );
    saveRentals(newRentals);
    set({ rentals: newRentals });

    useSkateStore.getState().updateSkateStatus(rental.skateId, SkateStatus.AVAILABLE);

    return { success: true, message: '取消成功' };
  },

  getRentalById: (id) => {
    return get().rentals.find(r => r.id === id);
  },

  getRentalsByPhone: (phone) => {
    return get().rentals
      .filter(r => r.phone === phone)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getRentalsByStatus: (status) => {
    return get().rentals
      .filter(r => r.status === status)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getActiveRentals: () => {
    return get().rentals
      .filter(r => r.status === RentalStatus.RENTING)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  resetData: () => {
    set({ rentals: [] });
  }
}));
