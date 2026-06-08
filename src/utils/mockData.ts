import { Skate, RentalOrder, SkateStatus, RentalStatus } from '../types';
import { BRAND_OPTIONS, COLOR_OPTIONS } from './constants';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function generateOrderNo(): string {
  const date = new Date();
  const prefix = 'IC' + date.getFullYear().toString().slice(-2) +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0');
  const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return prefix + suffix;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getDateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function generateMockSkates(): Skate[] {
  const sizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
  const skates: Skate[] = [];
  let skateIndex = 1;

  sizes.forEach((size, sizeIndex) => {
    const count = 4;
    for (let i = 0; i < count; i++) {
      let status: SkateStatus;
      if (i === 0) {
        status = SkateStatus.DISINFECTING;
      } else if (i === 1) {
        status = SkateStatus.RENTED;
      } else {
        status = SkateStatus.AVAILABLE;
      }

      const now = new Date().toISOString();
      const brandIndex = (sizeIndex + i) % BRAND_OPTIONS.length;
      const colorIndex = (sizeIndex + i + 1) % COLOR_OPTIONS.length;
      skates.push({
        id: generateId(),
        skateCode: `SK-${size.toString().padStart(2, '0')}-${skateIndex.toString().padStart(3, '0')}`,
        size,
        status,
        brand: BRAND_OPTIONS[brandIndex],
        color: COLOR_OPTIONS[colorIndex],
        createdAt: getDateOffset(-30 - ((sizeIndex * 3 + i) % 30)),
        updatedAt: now
      });
      skateIndex++;
    }
  });

  return skates;
}

export function generateMockRentals(skates: Skate[]): RentalOrder[] {
  const rentedSkates = skates.filter(s => s.status === SkateStatus.RENTED);
  const rentals: RentalOrder[] = [];

  const mockCustomers = [
    { name: '张三', phone: '13800138001' },
    { name: '李四', phone: '13800138002' },
    { name: '王五', phone: '13800138003' },
    { name: '赵六', phone: '13800138004' },
    { name: '钱七', phone: '13800138005' }
  ];

  rentedSkates.forEach((skate, index) => {
    const customer = mockCustomers[index % mockCustomers.length];
    const rentDaysAgo = 1 + Math.floor(Math.random() * 3);
    const rentTime = getDateOffset(-rentDaysAgo);
    const expectedReturnTime = getDateOffset(1);

    rentals.push({
      id: generateId(),
      orderNo: generateOrderNo(),
      skateId: skate.id,
      phone: customer.phone,
      customerName: customer.name,
      rentTime,
      expectedReturnTime,
      status: RentalStatus.RENTING,
      createdAt: rentTime,
      updatedAt: rentTime
    });
  });

  const returnedRentalsCount = 3;
  for (let i = 0; i < returnedRentalsCount; i++) {
    const customer = mockCustomers[i % mockCustomers.length];
    const rentTime = getDateOffset(-7 - i);
    const returnTime = getDateOffset(-5 - i);

    rentals.push({
      id: generateId(),
      orderNo: generateOrderNo(),
      skateId: `returned-${i}`,
      phone: customer.phone,
      customerName: customer.name,
      rentTime,
      expectedReturnTime: getDateOffset(-4 - i),
      actualReturnTime: returnTime,
      status: RentalStatus.RETURNED,
      createdAt: rentTime,
      updatedAt: returnTime
    });
  }

  return rentals;
}

export { generateId, generateOrderNo };
