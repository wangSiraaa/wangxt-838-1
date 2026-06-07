import { Skate, RentalOrder, SkateStatus, RentalStatus } from '../types';
import { PHONE_REGEX } from './constants';

export function canRentSkate(skate: Skate): { valid: boolean; message?: string } {
  if (skate.status === SkateStatus.DISINFECTING) {
    return {
      valid: false,
      message: '此冰鞋正在消毒中，暂不可出租'
    };
  }
  if (skate.status === SkateStatus.RENTED) {
    return {
      valid: false,
      message: '此冰鞋已被租借'
    };
  }
  return { valid: true };
}

export function canPhoneRent(
  phone: string,
  rentalOrders: RentalOrder[]
): { valid: boolean; message?: string } {
  const hasUnreturned = rentalOrders.some(
    order => order.phone === phone && order.status === RentalStatus.RENTING
  );
  if (hasUnreturned) {
    return {
      valid: false,
      message: '该手机号尚有未归还的冰鞋，请先归还后再租借'
    };
  }
  return { valid: true };
}

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone);
}

export function validateRentalSubmission(
  skate: Skate,
  phone: string,
  customerName: string,
  rentalOrders: RentalOrder[]
): { valid: boolean; message?: string } {
  if (!customerName.trim()) {
    return { valid: false, message: '请输入姓名' };
  }

  if (!isValidPhone(phone)) {
    return { valid: false, message: '请输入正确的手机号' };
  }

  const skateCheck = canRentSkate(skate);
  if (!skateCheck.valid) {
    return skateCheck;
  }

  const phoneCheck = canPhoneRent(phone, rentalOrders);
  if (!phoneCheck.valid) {
    return phoneCheck;
  }

  return { valid: true };
}
