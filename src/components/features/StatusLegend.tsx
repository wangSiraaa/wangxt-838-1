import { SkateStatus } from '../../types';
import { STATUS_LABELS, STATUS_DOT_COLORS } from '../../utils/constants';

export function StatusLegend() {
  const statuses = [
    { key: SkateStatus.AVAILABLE, label: STATUS_LABELS[SkateStatus.AVAILABLE] },
    { key: SkateStatus.RENTED, label: STATUS_LABELS[SkateStatus.RENTED] },
    { key: SkateStatus.DISINFECTING, label: STATUS_LABELS[SkateStatus.DISINFECTING] }
  ];

  return (
    <div className="flex items-center gap-6 bg-white rounded-xl border border-slate-200 px-5 py-3">
      <span className="text-sm font-medium text-slate-500">状态图例：</span>
      {statuses.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT_COLORS[key]} ${
              key === SkateStatus.DISINFECTING ? 'animate-pulse' : ''
            }`}
          />
          <span className="text-sm text-slate-700">{label}</span>
        </div>
      ))}
    </div>
  );
}
