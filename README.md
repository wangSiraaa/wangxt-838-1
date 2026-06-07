# 冰场租鞋尺码看板 Web 前端

一个基于 React + TypeScript + Vite 的冰场租鞋管理系统前端应用，所有数据存储在浏览器 LocalStorage 中，不依赖真实后端。

## 功能特性

### 核心流程
**尺码筛选 → 消毒状态展示 → 冰场租鞋尺码看板主流程**

### 用户角色
1. **前台管理员**：维护冰鞋库存、处理租借/归还、管理消毒流程
2. **游客**：查看自己的租借单、申请租借

### 核心业务规则
1. ✅ **消毒中冰鞋不能出租**：状态为 `DISINFECTING` 的冰鞋，出租按钮自动禁用并提示
2. ✅ **同一手机号未归还前不能再租**：租借时校验该手机号是否存在 `RENTING` 状态的订单
3. ✅ **数据持久化**：所有数据保存在 LocalStorage，刷新页面后数据不丢失
4. ✅ **归还自动进入消毒流程**：确认归还后冰鞋状态自动变为 `DISINFECTING`

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式**: TailwindCSS 3
- **状态管理**: Zustand 4
- **路由**: React Router v6
- **图标**: Lucide React
- **容器**: Docker + Nginx

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### Docker 部署（验收环境）

```bash
# 1. 构建并启动容器
docker-compose up -d --build

# 2. 查看容器状态
docker-compose ps

# 3. 停止容器
docker-compose down
```

容器启动后访问: http://localhost:3000

## 验收脚本与验证

### 验收前准备

```bash
# 1. 启动容器
docker-compose up -d --build

# 2. 等待容器就绪
sleep 5
```

### 验收用例 1: 选择消毒中冰鞋并验证出租按钮禁用

```bash
# 使用 Playwright 或类似工具执行以下验证步骤：
# 步骤说明：
# 1. 打开 http://localhost:3000
# 2. 在尺码看板中找到状态为"消毒中"的冰鞋卡片（橙色标签，带脉冲动画）
# 3. 验证该卡片的出租按钮为禁用状态（disabled）
# 4. 鼠标悬停到禁用按钮上，查看提示文字："此冰鞋正在消毒中，暂不可出租"

# data-testid 定位元素：
# - 冰鞋卡片: [data-testid="skate-card-{skateId}"]
# - 出租按钮: [data-testid="rent-button-{skateId}"]
# - 状态属性: [data-status="DISINFECTING"]

# 验证逻辑：
# const disinfectingCards = document.querySelectorAll('[data-status="DISINFECTING"]');
# disinfectingCards.forEach(card => {
#   const button = card.querySelector('[data-testid^="rent-button-"]');
#   expect(button.disabled).toBe(true);
#   expect(button.classList.contains('opacity-50')).toBe(true);
#   expect(button.classList.contains('cursor-not-allowed')).toBe(true);
# });
```

### 验收用例 2: 同一手机号未归还前不能再租

```bash
# 步骤说明：
# 1. 切换到前台管理员角色
# 2. 选择一双可租的冰鞋，点击出租按钮
# 3. 填写姓名和手机号（如：13800138001），提交租借
# 4. 再次选择另一双可租冰鞋，点击出租按钮
# 5. 填写相同手机号（13800138001），提交时应弹出提示：
#    "该手机号尚有未归还的冰鞋，请先归还后再租借"

# 验证逻辑：
# 租借表单提交时会调用 canPhoneRent() 函数进行校验
# 该函数在 src/utils/validator.ts 中实现
```

### 验收用例 3: 本地数据刷新后仍能复查

```bash
# 步骤说明：
# 1. 在尺码看板中执行若干操作（租借、归还、消毒）
# 2. 记录当前冰鞋状态和租借单数据
# 3. 刷新浏览器页面
# 4. 验证刷新后的数据与刷新前完全一致

# LocalStorage 存储键：
# - icerink_skates: 冰鞋库存数据
# - icerink_rentals: 租借单数据
# - icerink_initialized: 数据初始化标记

# 验证：localStorage.getItem('icerink_skates') 不为空
```

### 验收用例 4: 归还后自动进入消毒流程

```bash
# 步骤说明：
# 1. 切换到前台管理员角色
# 2. 进入"租借管理"页面
# 3. 找到一个"租借中"的订单，点击"确认归还"
# 4. 确认后查看该冰鞋状态，应变为"消毒中"
# 5. 在尺码看板中找到该冰鞋，验证出租按钮已禁用
```

## 项目结构

```
src/
├── components/          # 组件
│   ├── ui/             # 基础 UI 组件（Button、Card、Modal 等）
│   ├── layout/         # 布局组件（Header、Navigation、Layout）
│   └── features/       # 业务组件（SkateCard、SizeFilterBar 等）
├── pages/              # 页面
│   ├── Dashboard.tsx   # 尺码看板首页
│   ├── Inventory.tsx   # 库存管理
│   └── Rental.tsx      # 租借管理
├── stores/             # Zustand 状态管理
│   ├── useSkateStore.ts    # 冰鞋库存状态
│   ├── useRentalStore.ts   # 租借单状态
│   └── useUiStore.ts       # UI 状态
├── hooks/              # 自定义 Hooks
│   ├── useLocalStorage.ts
│   └── useValidation.ts
├── utils/              # 工具函数
│   ├── constants.ts    # 常量配置
│   ├── storage.ts      # LocalStorage 操作
│   ├── validator.ts    # 业务规则校验
│   └── mockData.ts     # Mock 数据生成
├── types/              # TypeScript 类型定义
├── lib/                # 公共库
│   └── utils.ts        # cn 类名合并工具
├── App.tsx             # 应用根组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 冰鞋状态流转

```
可租 (AVAILABLE) → 租借中 (RENTED) → 消毒中 (DISINFECTING) → 可租 (AVAILABLE)
     ↑                                                         ↑
     │                      归还/消毒完成                       │
     └─────────────────────────────────────────────────────────┘
```

## 状态颜色

| 状态 | 颜色 | 说明 |
|------|------|------|
| 可租 | 翠绿 (emerald) | 正常可租借状态 |
| 租借中 | 紫色 (violet) | 已被租借 |
| 消毒中 | 橙色 (orange) | 消毒中，带脉冲动画，不可出租 |

## 数据模型

### 冰鞋 (Skate)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 主键 |
| skateCode | string | 冰鞋编号 |
| size | number | 尺码 (35-46) |
| status | SkateStatus | 状态 |
| brand | string | 品牌 |
| color | string | 颜色 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

### 租借单 (RentalOrder)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 主键 |
| orderNo | string | 订单号 |
| skateId | string | 冰鞋 ID |
| phone | string | 租借人手机号 |
| customerName | string | 租借人姓名 |
| rentTime | string | 租借时间 |
| expectedReturnTime | string | 预计归还时间 |
| actualReturnTime | string | 实际归还时间 |
| status | RentalStatus | 订单状态 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

## 核心校验函数

### `canRentSkate(skate: Skate)`
位置: `src/utils/validator.ts`

检查冰鞋是否可出租：
- 消毒中 → 返回 `{ valid: false, message: '此冰鞋正在消毒中，暂不可出租' }`
- 租借中 → 返回 `{ valid: false, message: '此冰鞋已被租借' }`
- 可租 → 返回 `{ valid: true }`

### `canPhoneRent(phone: string, rentalOrders: RentalOrder[])`
位置: `src/utils/validator.ts`

检查手机号是否可租借：
- 存在未归还订单 → 返回 `{ valid: false, message: '该手机号尚有未归还的冰鞋，请先归还后再租借' }`
- 可租借 → 返回 `{ valid: true }`

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

需要支持 LocalStorage 和 ES6+ 特性。

## 开发规范

- 使用 TypeScript 类型定义
- 组件使用函数式组件 + Hooks
- 使用 TailwindCSS 进行样式开发
- 状态管理使用 Zustand
- 所有交互元素添加 `data-testid` 属性便于测试

## 许可证

MIT
