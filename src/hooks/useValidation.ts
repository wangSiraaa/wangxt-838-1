import { useState, useCallback } from 'react';
import { Skate, RentalOrder } from '../types';
import { canRentSkate, canPhoneRent, isValidPhone } from '../utils/validator';

export function useValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePhone = useCallback((phone: string): boolean => {
    const valid = isValidPhone(phone);
    setErrors(prev => ({
      ...prev,
      phone: valid ? '' : '请输入正确的手机号'
    }));
    return valid;
  }, []);

  const validateName = useCallback((name: string): boolean => {
    const valid = name.trim().length > 0;
    setErrors(prev => ({
      ...prev,
      name: valid ? '' : '请输入姓名'
    }));
    return valid;
  }, []);

  const validateSize = useCallback((size: number): boolean => {
    const valid = size >= 35 && size <= 46;
    setErrors(prev => ({
      ...prev,
      size: valid ? '' : '请选择有效的尺码(35-46)'
    }));
    return valid;
  }, []);

  const validateSkateCode = useCallback((code: string): boolean => {
    const valid = code.trim().length > 0;
    setErrors(prev => ({
      ...prev,
      skateCode: valid ? '' : '请输入冰鞋编号'
    }));
    return valid;
  }, []);

  const validateSkateRentable = useCallback((skate: Skate): { valid: boolean; message?: string } => {
    return canRentSkate(skate);
  }, []);

  const validatePhoneRentable = useCallback((phone: string, rentals: RentalOrder[]): { valid: boolean; message?: string } => {
    return canPhoneRent(phone, rentals);
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validatePhone,
    validateName,
    validateSize,
    validateSkateCode,
    validateSkateRentable,
    validatePhoneRentable,
    clearError,
    clearAllErrors
  };
}
