import { Calendar, Clock, User, Phone, CheckCircle, XCircle, Footprints } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RentalOrder, RentalStatus, UserRole, Skate } from '../../types';
import { useUiStore } from '../../stores/useUiStore';
import { cn } from '../../lib/utils';

interface RentalOrderCardProps {
  order: RentalOrder;
  skate?: Skate;
  onReturn?: (order: RentalOrder) => void;
  onCancel?: (order: RentalOrder) => void;
}

export function RentalOrderCard({ order, skate, onReturn, onCancel }: RentalOrderCardProps) {
  const currentRole = useUiStore(state => state.currentRole);
  const isAdmin = currentRole === UserRole.ADMIN;
  const isActive = order.status === RentalStatus.RENTING;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = isActive && new Date(order.expectedReturnTime) < new Date();

  return (
    <Card className={cn(
      'overflow-hidden',
      isOverdue && 'border-red-300 ring-1 ring-red-200'
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-mono text-sm text-slate-500 mb-1">{order.orderNo}</p>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-900">{order.customerName}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">{order.phone}</span>
            </div>
          </div>
          <Badge variant="rental" status={order.status} />
        </div>

        {skate && (
          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-slate-900">{skate.skateCode}</p>
              <p className="text-sm text-slate-500">
                {skate.size}码 · {skate.brand} · {skate.color}
              </p>
            </div>
            <Badge
              variant="skate"
              status={skate.status}
              pulse={skate.status === 'DISINFECTING'}
              className="ml-auto"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-slate-500 text-xs">租借时间</p>
              <p className="text-slate-700 font-medium">{formatDate(order.rentTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className={cn(
              'w-4 h-4 flex-shrink-0',
              isOverdue ? 'text-red-500' : 'text-slate-400'
            )} />
            <div>
              <p className={cn('text-xs', isOverdue ? 'text-red-500' : 'text-slate-500')}>
                {order.status === RentalStatus.RETURNED ? '归还时间' : '预计归还'}
              </p>
              <p className={cn('font-medium', isOverdue ? 'text-red-600' : 'text-slate-700')}>
                {formatDate(order.actualReturnTime || order.expectedReturnTime)}
                {isOverdue && <span className="text-xs ml-1">(已逾期)</span>}
              </p>
            </div>
          </div>
        </div>

        {isAdmin && isActive && (
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            {onReturn && (
              <Button
                variant="success"
                size="sm"
                onClick={() => onReturn(order)}
                className="flex-1 gap-1.5"
                data-testid={`return-button-${order.id}`}
              >
                <CheckCircle className="w-4 h-4" />
                确认归还
              </Button>
            )}
            {onCancel && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onCancel(order)}
                className="gap-1.5"
                data-testid={`cancel-button-${order.id}`}
              >
                <XCircle className="w-4 h-4" />
                取消
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
