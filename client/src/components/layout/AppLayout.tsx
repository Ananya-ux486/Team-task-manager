import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  Menu,
  X,
  CheckSquare,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuthStore();
  const logout = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-60 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0',
          'bg-gradient-to-b from-slate-900 to-slate-800',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight">TaskFlow</span>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">Team Manager</p>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">
            Menu
          </p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              location.pathname === href || location.pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                to={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full text-xs font-bold text-white flex-shrink-0 shadow">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-slate-400 hover:text-white hover:bg-white/10 justify-start gap-2.5 text-xs"
            onClick={() => logout.mutate()}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-4 lg:px-6 py-3.5 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-slate-700 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center justify-center w-7 h-7 bg-blue-600 rounded-lg">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">TaskFlow</span>
          </div>

          {/* Page title area — desktop */}
          <div className="hidden lg:block flex-1">
            <p className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Role badge */}
            <span
              className={cn(
                'hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
                user?.role === 'ADMIN'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600'
              )}
            >
              {user?.role}
            </span>
            {/* Avatar */}
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-xs font-bold text-white shadow">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
