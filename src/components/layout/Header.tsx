import { Snowflake, RotateCcw, User, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { useUiStore } from '../../stores/useUiStore';
import { UserRole } from '../../types';
import { cn } from '../../lib/utils';

export function Header() {
  const { currentRole, setCurrentRole } = useUiStore();

  const handleResetData = () => {
    if (confirm('确定要重置所有演示数据吗？此操作不可撤销。')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Snowflake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">冰场租鞋尺码看板</h1>
            <p className="text-xs text-slate-500">Ice Rink Rental Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <Button
              variant={currentRole === UserRole.ADMIN ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentRole(UserRole.ADMIN)}
              className={cn(
                'gap-1.5',
                currentRole !== UserRole.ADMIN && 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Users className="w-4 h-4" />
              管理员
            </Button>
            <Button
              variant={currentRole === UserRole.VISITOR ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentRole(UserRole.VISITOR)}
              className={cn(
                'gap-1.5',
                currentRole !== UserRole.VISITOR && 'text-slate-600 hover:text-slate-900'
              )}
            >
              <User className="w-4 h-4" />
              游客
            </Button>
          </div>

          <Button variant="secondary" size="sm" onClick={handleResetData} className="gap-1.5">
            <RotateCcw className="w-4 h-4" />
            重置数据
          </Button>
        </div>
      </div>
    </header>
  );
}
