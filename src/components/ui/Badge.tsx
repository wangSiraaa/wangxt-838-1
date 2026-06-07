import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { SkateStatus, RentalStatus } from '../../types';
import { STATUS_COLORS, STATUS_LABELS, RENTAL_STATUS_COLORS, RENTAL_STATUS_LABELS, STATUS_DOT_COLORS } from '../../utils/constants';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'skate' | 'rental';
  status?: SkateStatus | RentalStatus;
  pulse?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', status, pulse, children, ...props }, ref) => {
    let classes = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border';
    let label = children;
    let showDot = false;

    if (variant === 'skate' && status && status in SkateStatus) {
      classes = cn(classes, STATUS_COLORS[status as SkateStatus]);
      label = children || STATUS_LABELS[status as SkateStatus];
      showDot = true;
    } else if (variant === 'rental' && status && status in RentalStatus) {
      classes = cn(classes, RENTAL_STATUS_COLORS[status as RentalStatus]);
      label = children || RENTAL_STATUS_LABELS[status as RentalStatus];
      showDot = true;
    }

    return (
      <span ref={ref} className={cn(classes, className)} {...props}>
        {showDot && (
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              status && status in SkateStatus ? STATUS_DOT_COLORS[status as SkateStatus] : 'bg-slate-400',
              pulse && status === SkateStatus.DISINFECTING && 'animate-pulse'
            )}
          />
        )}
        {label}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
