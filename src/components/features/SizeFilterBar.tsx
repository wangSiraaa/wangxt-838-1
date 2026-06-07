import { Filter } from 'lucide-react';
import { Button } from '../ui/Button';
import { SIZE_OPTIONS } from '../../utils/constants';
import { useUiStore } from '../../stores/useUiStore';
import { useSkateStore } from '../../stores/useSkateStore';
import { cn } from '../../lib/utils';

export function SizeFilterBar() {
  const { sizeFilter, setSizeFilter } = useUiStore();
  const sizeStats = useSkateStore(state => state.getSizeStats());

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">按尺码筛选</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={sizeFilter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setSizeFilter('all')}
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
              onClick={() => setSizeFilter(size)}
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
