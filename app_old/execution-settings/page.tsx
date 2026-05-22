'use client';

import { motion } from 'framer-motion';
import { Settings, Chrome, Save, RefreshCw } from 'lucide-react';
import useStore from '@/lib/state';
import { cn } from '@/lib/utils';

export default function ExecutionSettingsPage() {
  const { settings, updateSettings } = useStore();

  const browsers = [
    { value: 'chrome', label: 'Chrome', icon: '🌐' },
    { value: 'firefox', label: 'Firefox', icon: '🦊' },
    { value: 'edge', label: 'Edge', icon: '🔷' },
    { value: 'safari', label: 'Safari', icon: '🧭' },
  ] as const;

  const SettingCard = ({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        <div>{children}</div>
      </div>
    </motion.div>
  );

  const Switch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        checked ? 'bg-violet-600' : 'bg-slate-700'
      )}
    >
      <motion.span
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg"
      />
    </button>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-slate-800"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Execution Settings</h1>
            <p className="text-slate-400">Configure test execution preferences</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-violet-600/30"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Browser Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center">
                <Chrome className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Browser</h3>
                <p className="text-sm text-slate-400">Select the browser for test execution</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {browsers.map((browser) => (
                <motion.button
                  key={browser.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateSettings({ browser: browser.value })}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all',
                    settings.browser === browser.value
                      ? 'bg-violet-600/20 border-violet-600 shadow-lg shadow-violet-600/20'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  )}
                >
                  <div className="text-3xl mb-2">{browser.icon}</div>
                  <p
                    className={cn(
                      'text-sm font-medium',
                      settings.browser === browser.value ? 'text-violet-400' : 'text-slate-300'
                    )}
                  >
                    {browser.label}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Toggle Settings */}
          <SettingCard
            title="Headless Mode"
            description="Run browser in headless mode (without UI) for faster execution"
          >
            <Switch
              checked={settings.headless}
              onChange={(checked) => updateSettings({ headless: checked })}
            />
          </SettingCard>

          <SettingCard
            title="Capture Screenshots"
            description="Automatically capture screenshots during test execution"
          >
            <Switch
              checked={settings.captureScreenshots}
              onChange={(checked) => updateSettings({ captureScreenshots: checked })}
            />
          </SettingCard>

          <SettingCard
            title="Capture Videos"
            description="Record video of the entire test execution process"
          >
            <Switch
              checked={settings.captureVideos}
              onChange={(checked) => updateSettings({ captureVideos: checked })}
            />
          </SettingCard>

          <SettingCard
            title="Auto Retry"
            description="Automatically retry failed tests to reduce flakiness"
          >
            <Switch
              checked={settings.autoRetry}
              onChange={(checked) => updateSettings({ autoRetry: checked })}
            />
          </SettingCard>

          {/* Max Retries */}
          {settings.autoRetry && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">Max Retries</h3>
                  <p className="text-sm text-slate-400">
                    Maximum number of retry attempts for failed tests
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateSettings({ maxRetries: Math.max(1, settings.maxRetries - 1) })
                    }
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-white w-8 text-center">
                    {settings.maxRetries}
                  </span>
                  <button
                    onClick={() =>
                      updateSettings({ maxRetries: Math.min(5, settings.maxRetries + 1) })
                    }
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reset to Defaults */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center pt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                updateSettings({
                  browser: 'chrome',
                  headless: false,
                  captureScreenshots: true,
                  captureVideos: false,
                  autoRetry: true,
                  maxRetries: 2,
                })
              }
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg font-medium transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reset to Defaults</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
