import { SkateStatus, RentalStatus } from '../types';

export const STORAGE_KEYS = {
  SKATES: 'icerink_skates',
  RENTALS: 'icerink_rentals',
  INITIALIZED: 'icerink_initialized'
} as const;

export const SIZE_OPTIONS: number[] = [
  35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46
];

export const STATUS_LABELS: Record<SkateStatus, string> = {
  [SkateStatus.AVAILABLE]: '可租',
  [SkateStatus.RENTED]: '租借中',
  [SkateStatus.DISINFECTING]: '消毒中'
};

export const STATUS_COLORS: Record<SkateStatus, string> = {
  [SkateStatus.AVAILABLE]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [SkateStatus.RENTED]: 'bg-violet-100 text-violet-700 border-violet-200',
  [SkateStatus.DISINFECTING]: 'bg-orange-100 text-orange-700 border-orange-200'
};

export const STATUS_DOT_COLORS: Record<SkateStatus, string> = {
  [SkateStatus.AVAILABLE]: 'bg-emerald-500',
  [SkateStatus.RENTED]: 'bg-violet-500',
  [SkateStatus.DISINFECTING]: 'bg-orange-500'
};

export const RENTAL_STATUS_LABELS: Record<RentalStatus, string> = {
  [RentalStatus.RENTING]: '租借中',
  [RentalStatus.RETURNED]: '已归还',
  [RentalStatus.CANCELLED]: '已取消'
};

export const RENTAL_STATUS_COLORS: Record<RentalStatus, string> = {
  [RentalStatus.RENTING]: 'bg-violet-100 text-violet-700',
  [RentalStatus.RETURNED]: 'bg-emerald-100 text-emerald-700',
  [RentalStatus.CANCELLED]: 'bg-slate-100 text-slate-700'
};

export const BRAND_OPTIONS = ['Bauer', 'CCM', 'Graf', 'Jackson', 'Edea', 'Riedell'];
export const COLOR_OPTIONS = ['黑色', '白色', '蓝色', '红色', '粉色', '灰色'];

export const PHONE_REGEX = /^1[3-9]\d{9}$/;
