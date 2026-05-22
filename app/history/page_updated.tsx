'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Search, Filter, X } from 'lucide-react';
import useStore from '@/lib/state';
import EmptyState from '@/components/EmptyState';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  const { history, searchQuery, setSearchQuery } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter history based on search and status
  const filteredHistory = history.filter((exec) => {
    const matchesSearch = !searchQuery || 
      exec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.browser.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || exec.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  if (history.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
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
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Execution History</h1>
            <p className="text-slate-600 dark:text-slate-400">
              {filteredHistory.length} of {history.length} execution(s)
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search executions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg">
            <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="partial">Partial</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 overflow-auto p-6"
      >
        {filteredHistory.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Execution ID
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Target
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Browser
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Tests
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Start Time
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((exec, index) => (
                  <motion.tr
                    key={exec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                    className="border-b border-slate-200 dark:border-slate-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-violet-600 dark:text-violet-400">{exec.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900 dark:text-white">{exec.target}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{exec.browser}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border',
                          exec.status === 'passed'
                            ? 'bg-green-600/20 text-green-600 dark:text-green-400 border-green-600/50'
                            : exec.status === 'failed'
                            ? 'bg-red-600/20 text-red-600 dark:text-red-400 border-red-600/50'
                            : 'bg-yellow-600/20 text-yellow-600 dark:text-yellow-400 border-yellow-600/50'
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
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          {exec.passedTests}
                        </span>
                        <span className="text-sm text-slate-400 dark:text-slate-500">/</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{exec.totalTests}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{exec.startTime}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{exec.duration}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12">
            <EmptyState
              icon={Search}
              title="No Results Found"
              description="Try adjusting your search or filter criteria"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
