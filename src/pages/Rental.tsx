import { useState, useMemo } from 'react';
import { Search, User, Phone, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { StatsCard } from '../components/features/StatsCard';
import { RentalOrderCard } from '../components/features/RentalOrderCard';
import { useRentalStore } from '../stores/useRentalStore';
import { useSkateStore } from '../stores/useSkateStore';
import { useUiStore } from '../stores/useUiStore';
import { RentalStatus, UserRole } from '../types';
import { cn } from '../lib/utils';

export function Rental() {
  const { rentals, returnRental, cancelRental, getStats } = useRentalStore();
  const { getSkateById } = useSkateStore();
  const currentRole = useUiStore(state => state.currentRole);
  const isAdmin = currentRole === UserRole.ADMIN;

  const stats = getStats();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RentalStatus>('all');
  const [phoneQuery, setPhoneQuery] = useState('');

  const filteredOrders = useMemo(() => {
    return rentals
      .filter(order => {
        const matchesSearch = !searchTerm ||
          order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.phone.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesPhone = !phoneQuery || order.phone.includes(phoneQuery);
        return matchesSearch && matchesStatus && matchesPhone;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [rentals, searchTerm, statusFilter, phoneQuery]);

  const handleReturn = (order: typeof rentals[0]) => {
    const skate = getSkateById(order.skateId);
    if (confirm(`确认归还冰鞋 ${skate?.skateCode}？\n归还后将自动进入消毒流程。`)) {
      const result = returnRental(order.id);
      if (result.success) {
        alert('归还成功！冰鞋已进入消毒流程。');
      } else {
        alert(result.message);
      }
    }
  };

  const handleCancel = (order: typeof rentals[0]) => {
    if (confirm(`确定取消租借单 ${order.orderNo}？`)) {
      const result = cancelRental(order.id);
      if (result.success) {
        alert('取消成功！');
      } else {
        alert(result.message);
      }
    }
  };

  const statsCards = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="总租借单"
        value={stats.total}
        icon={<Package className="w-5 h-5" />}
        color="sky"
      />
      <StatsCard
        title="租借中"
        value={stats.renting}
        icon={<Clock className="w-5 h-5" />}
        color="violet"
      />
      <StatsCard
        title="已归还"
        value={stats.returned}
        icon={<CheckCircle className="w-5 h-5" />}
        color="emerald"
      />
      <StatsCard
        title="已取消"
        value={stats.cancelled}
        icon={<XCircle className="w-5 h-5" />}
        color="orange"
      />
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">我的租借单</h1>
          <p className="text-slate-500 mt-1">游客查看 · 输入手机号查询您的租借记录</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            请输入您的手机号查询租借记录
          </label>
          <div className="flex gap-3">
            <Input
              name="phoneQuery"
              placeholder="请输入11位手机号"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value.replace(/\D/g, '').slice(0, 11))}
              icon={<Phone className="w-4 h-4" />}
              maxLength={11}
              className="flex-1"
            />
            <Button onClick={() => setPhoneQuery(phoneQuery)}>
              <Search className="w-4 h-4 mr-2" />
              查询
            </Button>
          </div>
        </div>

        {phoneQuery.length === 11 && (
          <>
            {statsCards}

            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                查询结果
                <span className="text-sm font-normal text-slate-500 ml-2">
                  手机号 {phoneQuery} · 共 {filteredOrders.length} 条记录
                </span>
              </h2>

              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 mb-1">暂无该手机号的租借记录</p>
                  <p className="text-sm text-slate-400">请前往尺码看板申请租借冰鞋</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders.map(order => {
                    const skate = getSkateById(order.skateId);
                    return (
                      <RentalOrderCard
                        key={order.id}
                        order={order}
                        skate={skate}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">租借管理</h1>
          <p className="text-slate-500 mt-1">冰场前台 · 管理所有租借订单</p>
        </div>
        <div className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
          filteredOrders.some(o => o.status === RentalStatus.RENTING && new Date(o.expectedReturnTime) < new Date())
            ? 'bg-red-100 text-red-700'
            : 'bg-emerald-100 text-emerald-700'
        )}>
          <span className={cn(
            'w-2 h-2 rounded-full',
            filteredOrders.some(o => o.status === RentalStatus.RENTING && new Date(o.expectedReturnTime) < new Date())
              ? 'bg-red-500 animate-pulse'
              : 'bg-emerald-500'
          )} />
          {filteredOrders.some(o => o.status === RentalStatus.RENTING && new Date(o.expectedReturnTime) < new Date())
            ? '存在逾期未归还订单'
            : '运营正常'
          }
        </div>
      </div>

      {statsCards}

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="搜索订单号、姓名、手机号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-40"
          >
            <option value="all">全部状态</option>
            <option value={RentalStatus.RENTING}>租借中</option>
            <option value={RentalStatus.RETURNED}>已归还</option>
            <option value={RentalStatus.CANCELLED}>已取消</option>
          </Select>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          全部订单
          <span className="text-sm font-normal text-slate-500 ml-2">
            共 {filteredOrders.length} 条
          </span>
        </h2>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-1">暂无租借订单</p>
            <p className="text-sm text-slate-400">前往尺码看板开始租借</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map(order => {
              const skate = getSkateById(order.skateId);
              return (
                <RentalOrderCard
                  key={order.id}
                  order={order}
                  skate={skate}
                  onReturn={handleReturn}
                  onCancel={handleCancel}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
