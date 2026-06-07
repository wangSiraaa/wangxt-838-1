export enum SkateStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  DISINFECTING = 'DISINFECTING'
}

export enum RentalStatus {
  RENTING = 'RENTING',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  VISITOR = 'VISITOR'
}

export interface Skate {
  id: string;
  skateCode: string;
  size: number;
  status: SkateStatus;
  brand: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface RentalOrder {
  id: string;
  orderNo: string;
  skateId: string;
  phone: string;
  customerName: string;
  rentTime: string;
  expectedReturnTime: string;
  actualReturnTime?: string;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryStats {
  total: number;
  available: number;
  rented: number;
  disinfecting: number;
}

export interface SizeStats {
  size: number;
  total: number;
  available: number;
  rented: number;
  disinfecting: number;
}

export type SizeFilter = number | 'all';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
