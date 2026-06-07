import { Footprints, Plus } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { Skate, SkateStatus, UserRole } from '../../types';
import { useUiStore } from '../../stores/useUiStore';
import { canRentSkate } from '../../utils/validator';
import { cn } from '../../lib/utils';

interface SkateCardProps {
  skate: Skate;
  onRent?: (skate: Skate) => void;
}

export function SkateCard({ skate, onRent }: SkateCardProps) {
  const { currentRole, setSelectedSkateId, setShowRentalModal } = useUiStore();
  const rentCheck = canRentSkate(skate);
  const isAdmin = currentRole === UserRole.ADMIN;

  const handleRentClick = () => {
    if (rentCheck.valid && onRent) {
      onRent(skate);
    } else if (rentCheck.valid) {
      setSelectedSkateId(skate.id);
      setShowRentalModal(true);
    }
  };

  const isDisinfecting = skate.status === SkateStatus.DISINFECTING;
  const isRented = skate.status === SkateStatus.RENTED;

  return (
    <Card
      className={cn(
        'relative overflow-hidden group',
        isDisinfecting && 'border-orange-300 ring-2 ring-orange-100',
        isRented && 'opacity-75'
      )}
      data-testid={`skate-card-${skate.id}`}
      data-status={skate.status}
    >
      {isDisinfecting && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 animate-pulse" />
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              skate.status === SkateStatus.AVAILABLE ? 'bg-emerald-100 text-emerald-600' :
              skate.status === SkateStatus.RENTED ? 'bg-violet-100 text-violet-600' :
              'bg-orange-100 text-orange-600'
            )}>
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{skate.skateCode}</p>
              <p className="text-xs text-slate-500">{skate.brand} · {skate.color}</p>
            </div>
          </div>
          <Badge variant="skate" status={skate.status} pulse={isDisinfecting} />
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-slate-900 tabular-nums">
              {skate.size}
              <span className="text-lg font-normal text-slate-500 ml-0.5">码</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              入库：{new Date(skate.createdAt).toLocaleDateString()}
            </p>
          </div>

          {isAdmin ? (
            <Tooltip content={rentCheck.message || '立即出租'}>
              <Button
                size="sm"
                variant={rentCheck.valid ? 'primary' : 'secondary'}
                onClick={handleRentClick}
                disabled={!rentCheck.valid}
                className="gap-1.5"
                data-testid={`rent-button-${skate.id}`}
              >
                <Plus className="w-4 h-4" />
                出租
              </Button>
            </Tooltip>
          ) : (
            <Tooltip content={rentCheck.message || '可申请租借'}>
              <Button
                size="sm"
                variant={rentCheck.valid ? 'success' : 'secondary'}
                onClick={handleRentClick}
                disabled={!rentCheck.valid}
                className="gap-1.5"
                data-testid={`rent-button-${skate.id}`}
              >
                <Plus className="w-4 h-4" />
                申请租借
              </Button>
            </Tooltip>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
