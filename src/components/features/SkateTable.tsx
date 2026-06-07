import { Edit2, Trash2, CheckCircle, Droplets } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Skate, SkateStatus, UserRole } from '../../types';
import { useUiStore } from '../../stores/useUiStore';
import { cn } from '../../lib/utils';

interface SkateTableProps {
  skates: Skate[];
  onEdit?: (skate: Skate) => void;
  onDelete?: (skate: Skate) => void;
  onMarkAvailable?: (skate: Skate) => void;
  onMarkDisinfecting?: (skate: Skate) => void;
}

export function SkateTable({
  skates,
  onEdit,
  onDelete,
  onMarkAvailable,
  onMarkDisinfecting
}: SkateTableProps) {
  const currentRole = useUiStore(state => state.currentRole);
  const isAdmin = currentRole === UserRole.ADMIN;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              冰鞋编号
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              尺码
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              品牌
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              颜色
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              状态
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              入库时间
            </th>
            {isAdmin && (
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                操作
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {skates.map(skate => (
            <tr
              key={skate.id}
              className={cn(
                'hover:bg-slate-50 transition-colors',
                skate.status === SkateStatus.DISINFECTING && 'bg-orange-50/30'
              )}
              data-testid={`skate-row-${skate.id}`}
            >
              <td className="px-4 py-3">
                <span className="font-medium text-slate-900">{skate.skateCode}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {skate.size}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{skate.brand}</td>
              <td className="px-4 py-3 text-slate-600">{skate.color}</td>
              <td className="px-4 py-3">
                <Badge
                  variant="skate"
                  status={skate.status}
                  pulse={skate.status === SkateStatus.DISINFECTING}
                />
              </td>
              <td className="px-4 py-3 text-sm text-slate-500">
                {new Date(skate.createdAt).toLocaleDateString()}
              </td>
              {isAdmin && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {skate.status === SkateStatus.DISINFECTING && onMarkAvailable && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => onMarkAvailable(skate)}
                        className="gap-1"
                        title="标记为可租"
                        data-testid={`mark-available-${skate.id}`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        消毒完成
                      </Button>
                    )}
                    {skate.status === SkateStatus.AVAILABLE && onMarkDisinfecting && (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => onMarkDisinfecting(skate)}
                        className="gap-1"
                        title="标记为消毒中"
                        data-testid={`mark-disinfecting-${skate.id}`}
                      >
                        <Droplets className="w-3.5 h-3.5" />
                        开始消毒
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(skate)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(skate)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {skates.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          暂无冰鞋数据
        </div>
      )}
    </div>
  );
}
