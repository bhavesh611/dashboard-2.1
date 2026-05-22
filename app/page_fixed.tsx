'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  FileCode,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import useStore from '@/lib/state';
import EmptyState from '@/components/EmptyState';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function DashboardPage() {
  const { activeExecutions, history, getTotalTestCases } = useStore();
  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Get ONLY running executions (not completed)
  const runningExecutions = activeExecutions.filter((e) => e.status === 'running');
  
  // Total test cases from file structure
  const totalTestCases = getTotalTestCases();
  
  // Combine all executions
  const allExecutions = [
    ...history,
    ...activeExecutions.filter(e => e.status === 'completed').map(exec => ({
      id: exec.id,
      target: exec.files.join(', '),
      browser: exec.browser.charAt(0).toUpperCase() + exec.browser.slice(1),
      status: (
        exec.testCases.filter(tc => tc.status === 'failed').length === 0 ? 'passed' :
        exec.testCases.filter(tc => tc.status === 'passed').length === 0 ? 'failed' : 'partial'
      ) as 'passed' | 'failed' | 'partial',
      startTime: new Date(exec.startTime).toLocaleString(),
      duration: 'N/A',
      totalTests: exec.testCases.length,
      passedTests: exec.testCases.filter(tc => tc.status === 'passed').length,
      failedTests: exec.testCases.filter(tc => tc.status === 'failed').length,
    }))
  ];
  
  // Apply filters
  const filteredExecutions = allExecutions.filter(exec => {
    if (statusFilter !== 'all' && exec.status !== statusFilter) return false;
    // Add date filtering logic here if needed
    return true;
  });
  
  // Calculate metrics
  const totalTestsRun = filteredExecutions.reduce((sum, exec) => sum + exec.totalTests, 0);
  const totalPassed = filteredExecutions.reduce((sum, exec) => sum + exec.passedTests, 0);
  const totalFailed = filteredExecutions.reduce((sum, exec) => sum + exec.failedTests, 0);
  const passRate = totalTestsRun > 0 ? Math.round((totalPassed / totalTestsRun) * 100) : 0;

  // Chart data
  const chartData = filteredExecutions.slice(0, 7).reverse().map((exec, i) => ({
    name: `Run ${filteredExecutions.length - i}`,
    passed: exec.passedTests,
    failed: exec.failedTests,
    passRate: exec.totalTests > 0 ? Math.round((exec.passedTests / exec.totalTests) * 100) : 0,
  }));

  const MetricCard = ({
    icon: Icon,
    label,
    value,
    color,
    delay = 0,
  }: {
    icon: any;
    label: string;
    value: string | number;
    color: string;
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl transition-all shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      </div>
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.1 }}
        className="text-3xl font-bold text-slate-900 dark:text-white mb-1"
      >
        {value}
      </motion.h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm">{label}</p>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Monitor your automation testing performance</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
          >
            <option value="all">All Status</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="partial">Partial</option>
          </select>
        </div>
        
        <div className="ml-auto text-sm text-slate-600 dark:text-slate-400">
          Showing {filteredExecutions.length} of {allExecutions.length} executions
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          icon={FileCode}
          label="Total Test Cases"
          value={totalTestCases}
          color="from-violet-600 to-purple-600"
          delay={0}
        />
        <MetricCard
          icon={Activity}
          label="Active Executions"
          value={runningExecutions.length}
          color="from-green-600 to-emerald-600"
          delay={0.05}
        />
        <MetricCard
          icon={CheckCircle}
          label="Tests Passed"
          value={totalPassed}
          color="from-blue-600 to-cyan-600"
          delay={0.1}
        />
        <MetricCard
          icon={XCircle}
          label="Tests Failed"
          value={totalFailed}
          color="from-red-600 to-rose-600"
          delay={0.15}
        />
        <MetricCard
          icon={TrendingUp}
          label="Pass Rate"
          value={`${passRate}%`}
          color="from-amber-600 to-orange-600"
          delay={0.2}
        />
      </div>

      {/* Charts Section */}
      {filteredExecutions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pass/Fail Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Test Results Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="passed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pass Rate Trend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Pass Rate Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="passRate"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      ) : null}

      {/* Recent Executions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Executions</h3>
          <Link href="/history">
            <motion.button
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-500 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>

        {filteredExecutions.length > 0 ? (
          <div className="space-y-3">
            {filteredExecutions.slice(0, 5).map((exec, index) => (
              <motion.div
                key={exec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
              >
                {/* Main Row */}
                <div
                  onClick={() => setExpandedExecution(expandedExecution === exec.id ? null : exec.id)}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        exec.status === 'passed'
                          ? 'bg-green-600/20'
                          : exec.status === 'failed'
                          ? 'bg-red-600/20'
                          : 'bg-yellow-600/20'
                      }`}
                    >
                      {exec.status === 'passed' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : exec.status === 'failed' ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{exec.target}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {exec.browser} • {exec.startTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {exec.passedTests}/{exec.totalTests}
                      </p>
                      <p className="text-xs text-slate-400">Passed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">{exec.failedTests}</p>
                      <p className="text-xs text-slate-400">Failed</p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        exec.status === 'passed'
                          ? 'bg-green-600/20 text-green-400 border border-green-600/50'
                          : exec.status === 'failed'
                          ? 'bg-red-600/20 text-red-400 border border-red-600/50'
                          : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/50'
                      }`}
                    >
                      {exec.status.toUpperCase()}
                    </motion.div>
                    <motion.div
                      animate={{ rotate: expandedExecution === exec.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    </motion.div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedExecution === exec.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Execution ID</p>
                            <p className="text-sm font-mono text-violet-600 dark:text-violet-400">{exec.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Duration</p>
                            <p className="text-sm text-slate-900 dark:text-white">{exec.duration}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pass Rate</p>
                            <p className="text-sm text-slate-900 dark:text-white">
                              {exec.totalTests > 0 ? Math.round((exec.passedTests / exec.totalTests) * 100) : 0}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Clock}
            title="No Execution History"
            description="Run your first test to see execution history here"
            actionLabel="Explore Tests"
            actionHref="/file-explorer"
          />
        )}
      </motion.div>
    </div>
  );
}
