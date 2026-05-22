'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderTree,
  Play,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import useStore from '@/lib/state';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/file-explorer', label: 'File Explorer', icon: FolderTree },
  { href: '/active-execution', label: 'Active Execution', icon: Play },
  { href: '/history', label: 'History', icon: History },
  { href: '/execution-settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { ui, toggleSidebar } = useStore();
  const collapsed = ui.sidebarCollapsed;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800"
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">IQ</span>
            </div>
            <span className="font-semibold text-lg text-slate-900 dark:text-white">IQM Automation</span>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">IQ</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white',
                  collapsed && 'justify-center'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        )}
      </button>
    </motion.aside>
  );
}
