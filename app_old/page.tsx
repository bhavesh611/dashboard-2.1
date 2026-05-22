'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  FolderTree,
  Activity,
} from 'lucide-react';
import useStore from '@/lib/state';
import EmptyState from '@/components/EmptyState';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function DashboardPage() {
  const { activeExecutions, history, selectedFiles } = useStore();
  const runningExecutions = activeExecutions.filter((e) => e.status === 'running');

  // Calculate metrics
  const totalTests = history.reduce((sum, h) => sum + h.totalTests, 0);
  const totalPassed = history.reduce((sum, h) => sum + h.passedTests, 0);
  const totalFailed = history.reduce((sum, h) => sum + h.failedTests, 0);
  const passRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

  // Chart data - last 7 executions
  const chartData = history.slice(0, 7).reverse().map((h, i) => ({
    name: `Run ${i + 1}`,
    passed: h.passedTests,
    failed: h.failedTests,
    passRate: h.totalTests > 0 ? Math.round((h.passedTests / h.totalTests) * 100) : 0,
  }));

  const MetricCard = ({
    icon: Icon,
    label,
    value,
    trend,
    color,
  }: {
    icon: any;
    label: string;
    value: string | number;
    trend?: string;
    color: string;
  }) => (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-slate-400 text-sm">{label}</p>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Monitor your automation testing performance</p>
        </div>
        <Link href="/file-explorer">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-violet-600/30"
          >
            <FolderTree className="w-5 h-5" />
            <span>Open File Explorer</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          icon={Activity}
          label="Active Executions"
          value={runningExecutions.length}
          color="from-green-600 to-emerald-600"
        />
        <MetricCard
          icon={CheckCircle}
          label="Tests Passed"
          value={totalPassed}
          trend="+12%"
          color="from-blue-600 to-cyan-600"
        />
        <MetricCard
          icon={XCircle}
          label="Tests Failed"
          value={totalFailed}
          color="from-red-600 to-rose-600"
        />
        <MetricCard
          icon={TrendingUp}
          label="Pass Rate"
          value={`${passRate}%`}
          trend="+5%"
          color="from-violet-600 to-purple-600"
        />
      </motion.div>

      {/* Charts Section */}
      {history.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pass/Fail Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Test Results Overview</h3>
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
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Pass Rate Trend</h3>
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
        transition={{ delay: 0.4 }}
        className="bg-slate-900 border border-slate-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Executions</h3>
          <Link href="/history">
            <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              View All →
            </button>
          </Link>
        </div>

        {history.length > 0 ? (
          <div className="space-y-3">
            {history.slice(0, 5).map((exec, index) => (
              <motion.div
                key={exec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
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
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{exec.target}</p>
                    <p className="text-xs text-slate-400">
                      {exec.browser} • {exec.startTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {exec.passedTests}/{exec.totalTests}
                    </p>
                    <p className="text-xs text-slate-400">Passed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{exec.duration}</p>
                    <p className="text-xs text-slate-400">Duration</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      exec.status === 'passed'
                        ? 'bg-green-600/20 text-green-400 border border-green-600/50'
                        : exec.status === 'failed'
                        ? 'bg-red-600/20 text-red-400 border border-red-600/50'
                        : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/50'
                    }`}
                  >
                    {exec.status.toUpperCase()}
                  </div>
                </div>
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
