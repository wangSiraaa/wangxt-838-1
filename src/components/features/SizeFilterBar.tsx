import { useMemo } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { SIZE_OPTIONS } from '../../utils/constants';
import { useUiStore } from '../../stores/useUiStore';
import { useSkateStore } from '../../stores/useSkateStore';
import { cn } from '../../lib/utils';
import { SkateStatus, SizeStats, Skate, SizeFilter } from '../../types';

function calculateSizeStats(skates: Skate[]): SizeStats[] {
  return SIZE_OPTIONS.map(size => {
    const sizeSkates = skates.filter(s => s.size === size);
    return {
      size,
      total: sizeSkates.length,
      available: sizeSkates.filter(s => s.status === SkateStatus.AVAILABLE).length,
      rented: sizeSkates.filter(s => s.status === SkateStatus.RENTED).length,
      disinfecting: sizeSkates.filter(s => s.status === SkateStatus.DISINFECTING).length
    };
  });
}

interface SizeFilterBarProps {
  onSizeSelect?: (size: SizeFilter) => void;
}

export function SizeFilterBar({ onSizeSelect }: SizeFilterBarProps) {
  const { sizeFilter, setSizeFilter } = useUiStore();
  const skates = useSkateStore(state => state.skates);
  const sizeStats = useMemo(() => calculateSizeStats(skates), [skates]);

  const handleSizeChange = (size: SizeFilter) => {
    setSizeFilter(size);
    onSizeSelect?.(size);
  };

  const mobileOptions = useMemo(() => {
    const options: { value: string | number; label: string }[] = [
      { value: 'all', label: '全部' }
    ];
    SIZE_OPTIONS.forEach(size => {
      const stats = sizeStats.find(s => s.size === size);
      const count = stats?.available || 0;
      options.push({
        value: size,
        label: `${size}码${count > 0 ? ` (可租${count})` : ''}`
      });
    });
    return options;
  }, [sizeStats]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">按尺码筛选</span>
      </div>

      <div className="sm:hidden">
        <Select
          value={sizeFilter === 'all' ? 'all' : sizeFilter}
          onChange={(e) => {
            const val = e.target.value;
            handleSizeChange(val === 'all' ? 'all' : Number(val));
          }}
          options={mobileOptions}
          className="w-full"
        />
      </div>

      <div className="hidden sm:flex flex-wrap gap-2">
        <Button
          variant={sizeFilter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleSizeChange('all')}
          className={cn(
            'rounded-full px-4',
            sizeFilter !== 'all' && 'bg-slate-100 hover:bg-slate-200'
          )}
        >
          全部
        </Button>
        {SIZE_OPTIONS.map(size => {
          const stats = sizeStats.find(s => s.size === size);
          const count = stats?.available || 0;
          return (
            <Button
              key={size}
              variant={sizeFilter === size ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleSizeChange(size)}
              className={cn(
                'rounded-full px-4 gap-1',
                sizeFilter !== size && 'bg-slate-100 hover:bg-slate-200'
              )}
            >
              <span>{size}码</span>
              {count > 0 && (
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-xs font-medium',
                  sizeFilter === size
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 text-emerald-700'
                )}>
                  {count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
