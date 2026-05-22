'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, XCircle, Clock, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import useStore from '@/lib/state';
import EmptyState from '@/components/EmptyState';
import { cn } from '@/lib/utils';

export default function ActiveExecutionPage() {
  const { activeExecutions } = useStore();
  const logsEndRef = useRef<HTMLDivElement>(null);
  const runningExecutions = activeExecutions.filter((e) => e.status === 'running');
  const latestExecution = activeExecutions[activeExecutions.length - 1];

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [latestExecution?.logs]);

  if (activeExecutions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <EmptyState
          icon={Play}
          title="No Active Executions"
          description="Select test files and run them to see live execution progress here"
          actionLabel="Open File Explorer"
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Active Execution</h1>
            <p className="text-slate-600 dark:text-slate-400">
              {runningExecutions.length > 0
                ? `${runningExecutions.length} execution(s) in progress`
                : 'All executions completed'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {runningExecutions.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/20 border border-green-600/50"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <span className="text-sm font-medium text-green-400">Live</span>
              </motion.div>
            )}
            <Link href="/history">
              <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-500 transition-colors"
              >
                <span>View All History</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Execution List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-80 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-4 space-y-3 bg-white dark:bg-slate-900"
        >
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Execution Queue
          </h3>
          {activeExecutions.map((exec, index) => (
            <motion.div
              key={exec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                'p-4 rounded-lg border transition-all cursor-pointer',
                exec.id === latestExecution?.id
                  ? 'bg-violet-600/20 border-violet-600/50 shadow-lg'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {exec.status === 'running' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    >
                      <Activity className="w-4 h-4 text-green-400" />
                    </motion.div>
                  ) : (
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{exec.id}</span>
                </div>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    exec.status === 'running'
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-blue-600/20 text-blue-400'
                  )}
                >
                  {exec.status === 'running' ? 'Running' : 'Completed'}
                </span>
              </div>
              <p className="text-sm text-slate-900 dark:text-white font-medium mb-1 truncate">
                {exec.files.length} file(s)
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                {exec.browser.toUpperCase()} • {exec.headless ? 'Headless' : 'Headed'}
              </p>
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${exec.progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-violet-600 to-purple-600"
                />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 text-right">{exec.progress}%</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Middle Panel - Test Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-y-auto p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Test Cases</h3>
            {latestExecution && (
              <div className="space-y-3">
                {latestExecution.testCases.map((testCase, index) => (
                  <motion.div
                    key={testCase.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {testCase.status === 'pending' && (
                          <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        )}
                        {testCase.status === 'running' && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          >
                            <Activity className="w-5 h-5 text-blue-400" />
                          </motion.div>
                        )}
                        {testCase.status === 'passed' && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        {testCase.status === 'failed' && (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{testCase.name}</span>
                      </div>
                      {testCase.status === 'passed' || testCase.status === 'failed' ? (
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium border',
                            testCase.status === 'passed'
                              ? 'bg-green-600/20 text-green-600 dark:text-green-400 border-green-600/50'
                              : 'bg-red-600/20 text-red-600 dark:text-red-400 border-red-600/50'
                          )}
                        >
                          {testCase.status === 'passed' ? 'PASSED' : 'FAILED'}
                        </span>
                      ) : null}
                    </div>
                    {/* Progress Bar for running tests */}
                    {testCase.status === 'running' && (
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${testCase.progress}%` }}
                          transition={{ duration: 0.2 }}
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-600"
                        />
                      </div>
                    )}
                    {testCase.duration && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        Duration: {testCase.duration.toFixed(2)}s
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Panel - Live Logs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-96 border-l border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900"
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Live Logs
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto bg-black p-4 font-mono text-xs">
            {latestExecution?.logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'mb-1',
                  log.level === 'info' && 'text-slate-400',
                  log.level === 'success' && 'text-green-400',
                  log.level === 'error' && 'text-red-400',
                  log.level === 'warning' && 'text-yellow-400'
                )}
              >
                <span className="text-slate-600">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>{' '}
                {log.message}
              </motion.div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
