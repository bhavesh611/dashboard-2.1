'use client';

import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import useStore from '@/lib/state';
import ThemeToggle from './ThemeToggle';
import dynamic from 'next/dynamic';

const ThemeToggleDynamic = dynamic(() => import('./ThemeToggle'), { ssr: false });

export default function Navbar() {
  const { activeExecutions } = useStore();
  const pathname = usePathname();
  const runningCount = activeExecutions.filter((e) => e.status === 'running').length;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 glass border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 z-10 bg-white/40 dark:bg-slate-900/40 transition-colors"
    >
      {/* Left Section - Page Title */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {pathname === '/' && 'Dashboard'}
          {pathname === '/file-explorer' && 'File Explorer'}
          {pathname === '/active-execution' && 'Active Execution'}
          {pathname === '/history' && 'Execution History'}
          {pathname === '/execution-settings' && 'Settings'}
        </h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Active Executions Badge */}
        {runningCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-600/20 border border-green-600/50"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span className="text-sm font-medium text-green-400">
              {runningCount} Running
            </span>
          </motion.div>
        )}

        {/* Theme Toggle */}
        <ThemeToggleDynamic />

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-violet-600 rounded-full" />
        </button>
      </div>
    </motion.header>
  );
}
