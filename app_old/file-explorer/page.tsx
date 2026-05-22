'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Play, Rocket } from 'lucide-react';
import useStore from '@/lib/state';
import FileTree from '@/components/FileTree';
import CodeViewer from '@/components/CodeViewer';

export default function FileExplorerPage() {
  const router = useRouter();
  const { selectedFiles, runSelectedTests } = useStore();

  const handleRunTests = () => {
    runSelectedTests({ deterministic: false });
    router.push('/active-execution');
  };

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
            <h1 className="text-3xl font-bold text-white mb-2">File Explorer</h1>
            <p className="text-slate-400">
              Select test files to run • {selectedFiles.length} file(s) selected
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - File Tree */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-96 border-r border-slate-800 overflow-y-auto p-4"
        >
          <FileTree />
        </motion.div>

        {/* Right Panel - Code Viewer */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 p-6 overflow-hidden"
        >
          <CodeViewer />
        </motion.div>
      </div>

      {/* Floating Action Button */}
      {selectedFiles.length > 0 && (
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRunTests}
          className="fixed bottom-8 right-8 w-16 h-16 glass glass-hover rounded-full shadow-2xl shadow-violet-600/50 flex items-center justify-center group"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Rocket className="w-7 h-7 text-violet-400 group-hover:text-white transition-colors" />
          </motion.div>
          <div className="absolute -top-12 right-0 px-4 py-2 glass rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <p className="text-sm font-medium text-white">Run {selectedFiles.length} test(s)</p>
          </div>
        </motion.button>
      )}
    </div>
  );
}
