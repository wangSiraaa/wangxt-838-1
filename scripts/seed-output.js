#!/usr/bin/env node
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedPath = join(__dirname, '..', 'seed-838.json');

try {
  const seedData = JSON.parse(readFileSync(seedPath, 'utf8'));
  
  console.log('=== 冰场租鞋尺码看板 - 业务编号 ===');
  console.log(`\n种子编号: ${seedData.seed}`);
  console.log(`描述: ${seedData.description}`);
  console.log(`创建时间: ${seedData.createdAt}`);
  
  console.log('\n--- 冰鞋库存编号 ---');
  if (seedData.skates && seedData.skates.length > 0) {
    seedData.skates.forEach((skate, index) => {
      console.log(`${index + 1}. ${skate.skateCode} (${skate.size}码 - ${skate.status})`);
    });
  }
  
  console.log('\n--- 租借单业务编号 ---');
  if (seedData.rentals && seedData.rentals.length > 0) {
    seedData.rentals.forEach((rental, index) => {
      console.log(`${index + 1}. ${rental.orderNo}`);
      console.log(`   手机号: ${rental.phone}`);
      console.log(`   客户: ${rental.customerName}`);
      console.log(`   状态: ${rental.status}`);
      console.log(`   冰鞋: ${rental.skateId}`);
    });
  }
  
  console.log('\n--- 测试用例 ---');
  if (seedData.testCases) {
    console.log('手机号重复租借测试:');
    console.log(`  测试手机号: ${seedData.testCases.phoneRepeatRental.phone}`);
    console.log(`  预期提示: ${seedData.testCases.phoneRepeatRental.expectedMessage}`);
    console.log(`  目标冰鞋: ${seedData.testCases.phoneRepeatRental.skateId}`);
  }
  
  console.log('\n=== 输出完成 ===');
  
  const orderNos = seedData.rentals?.map(r => r.orderNo) || [];
  console.log(`\n业务编号列表: ${orderNos.join(', ')}`);
  
} catch (error) {
  console.error('读取种子数据失败:', error.message);
  process.exit(1);
}
