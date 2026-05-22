'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';
import useStore from '@/lib/state';
import EmptyState from '@/components/EmptyState';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  const { history } = useStore();

  if (history.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <EmptyState
          icon={Clock}
          title="No Execution History"
          description="Your test execution history will appear here once you run your first test suite"
          actionLabel="Explore Tests"
          actionHref="/file-explorer"
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-slate-800"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Execution History</h1>
            <p className="text-slate-400">{history.length} total execution(s)</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search executions..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-all">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 overflow-auto p-6"
      >
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                  Execution ID
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                  Target
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                  Browser
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                  Tests
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                  Start Time
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((exec, index) => (
                <motion.tr
                  key={exec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-violet-400">{exec.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white">{exec.target}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{exec.browser}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border',
                        exec.status === 'passed'
                          ? 'bg-green-600/20 text-green-400 border-green-600/50'
                          : exec.status === 'failed'
                          ? 'bg-red-600/20 text-red-400 border-red-600/50'
                          : 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50'
                      )}
                    >
                      {exec.status === 'passed' && <CheckCircle className="w-3 h-3" />}
                      {exec.status === 'failed' && <XCircle className="w-3 h-3" />}
                      {exec.status === 'partial' && <Clock className="w-3 h-3" />}
                      {exec.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-400 font-medium">
                        {exec.passedTests}
                      </span>
                      <span className="text-sm text-slate-500">/</span>
                      <span className="text-sm text-slate-400">{exec.totalTests}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400">{exec.startTime}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400">{exec.duration}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
