import { useMemo, useRef, useCallback } from 'react';
import { LayoutGrid, ShoppingBag, Users, Droplets } from 'lucide-react';
import { StatsCard } from '../components/features/StatsCard';
import { SizeFilterBar } from '../components/features/SizeFilterBar';
import { StatusLegend } from '../components/features/StatusLegend';
import { SkateCard } from '../components/features/SkateCard';
import { RentalModal } from '../components/features/RentalModal';
import { useSkateStore } from '../stores/useSkateStore';
import { useUiStore } from '../stores/useUiStore';
import { SkateStatus, InventoryStats, Skate, SizeFilter } from '../types';

function calculateStats(skates: Skate[]): InventoryStats {
  return {
    total: skates.length,
    available: skates.filter(s => s.status === SkateStatus.AVAILABLE).length,
    rented: skates.filter(s => s.status === SkateStatus.RENTED).length,
    disinfecting: skates.filter(s => s.status === SkateStatus.DISINFECTING).length
  };
}

export function Dashboard() {
  const skates = useSkateStore(state => state.skates);
  const getSkatesBySize = useSkateStore(state => state.getSkatesBySize);
  const { sizeFilter } = useUiStore();
  const gridRef = useRef<HTMLDivElement>(null);

  const handleSizeSelect = useCallback((size: SizeFilter) => {
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const stats = useMemo(() => calculateStats(skates), [skates]);

  const filteredSkates = useMemo(() => {
    return getSkatesBySize(sizeFilter);
  }, [getSkatesBySize, sizeFilter]);

  const skateGrid = useMemo(() => {
    if (filteredSkates.length === 0) {
      return (
        <div className="col-span-full text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <LayoutGrid className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 mb-2">暂无{sizeFilter !== 'all' ? `${sizeFilter}码` : ''}冰鞋数据</p>
          <p className="text-sm text-slate-400">请前往库存管理页面添加冰鞋</p>
        </div>
      );
    }

    return filteredSkates.map(skate => (
      <SkateCard key={skate.id} skate={skate} />
    ));
  }, [filteredSkates, sizeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">冰场租鞋尺码看板</h1>
          <p className="text-slate-500 mt-1">实时库存状态 · 按尺码快速筛选</p>
        </div>
        <StatusLegend />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="总冰鞋数"
          value={stats.total}
          icon={<LayoutGrid className="w-5 h-5" />}
          color="sky"
        />
        <StatsCard
          title="可租借"
          value={stats.available}
          icon={<ShoppingBag className="w-5 h-5" />}
          color="emerald"
        />
        <StatsCard
          title="租借中"
          value={stats.rented}
          icon={<Users className="w-5 h-5" />}
          color="violet"
        />
        <StatsCard
          title="消毒中"
          value={stats.disinfecting}
          icon={<Droplets className="w-5 h-5" />}
          color="orange"
        />
      </div>

      <SizeFilterBar onSizeSelect={handleSizeSelect} />

      <div ref={gridRef} id="skate-grid-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {sizeFilter === 'all' ? '全部冰鞋' : `${sizeFilter}码冰鞋`}
            <span className="text-sm font-normal text-slate-500 ml-2">
              共 {filteredSkates.length} 双
            </span>
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              可租 {filteredSkates.filter(s => s.status === SkateStatus.AVAILABLE).length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              租借中 {filteredSkates.filter(s => s.status === SkateStatus.RENTED).length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              消毒中 {filteredSkates.filter(s => s.status === SkateStatus.DISINFECTING).length}
            </span>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          data-testid="skate-grid"
        >
          {skateGrid}
        </div>
      </div>

      <RentalModal />
    </div>
  );
}
