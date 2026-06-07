import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: 'sky' | 'emerald' | 'violet' | 'orange';
  trend?: { value: number; isUp: boolean };
}

const gradientClasses: Record<string, string> = {
  sky: 'from-sky-500 to-blue-600',
  emerald: 'from-emerald-500 to-teal-600',
  violet: 'from-violet-500 to-purple-600',
  orange: 'from-orange-500 to-amber-600'
};

const borderClasses: Record<string, string> = {
  sky: 'border-sky-200',
  emerald: 'border-emerald-200',
  violet: 'border-violet-200',
  orange: 'border-orange-200'
};

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-5 bg-white transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1',
        borderClasses[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 tabular-nums">{value}</p>
        </div>
        <div
          className={cn(
            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg',
            gradientClasses[color]
          )}
        >
          {icon}
        </div>
      </div>
      <div
        className={cn(
          'absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br',
          gradientClasses[color]
        )}
      />
    </div>
  );
}
