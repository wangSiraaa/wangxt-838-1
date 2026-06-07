import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { path: '/', label: '尺码看板', icon: LayoutDashboard },
  { path: '/inventory', label: '库存管理', icon: Package },
  { path: '/rental', label: '租借管理', icon: ClipboardList }
];

export function Navigation() {
  return (
    <nav className="w-full border-b border-slate-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                  isActive
                    ? 'text-sky-600 border-sky-500'
                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
                )
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
