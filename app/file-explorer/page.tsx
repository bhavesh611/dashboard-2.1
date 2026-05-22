'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Play, Search, X } from 'lucide-react';
import useStore from '@/lib/state';
import FileTree from '@/components/FileTree';
import CodeViewer from '@/components/CodeViewer';

export default function FileExplorerPage() {
  const router = useRouter();
  const { selectedFiles, runSelectedTests, addToast, filesTree } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate total files correctly
  const countFiles = (tree: any): number => {
    let count = 0;
    Object.values(tree).forEach((node: any) => {
      if (node.type === 'folder' && node.children) {
        count += countFiles(node.children);
      } else if (node.type === 'file') {
        count += 1;
      }
    });
    return count;
  };

  const totalFiles = countFiles(filesTree);
  const totalFolders = Object.keys(filesTree).length;

  const handleRunTests = () => {
    if (selectedFiles.length === 0) {
      addToast({
        type: 'warning',
        message: 'Please select at least one test file to run',
      });
      return;
    }

    addToast({
      type: 'success',
      message: `Starting execution for ${selectedFiles.length} test file(s)`,
    });
    
    runSelectedTests({ deterministic: false });
    router.push('/active-execution');
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">File Explorer</h1>
            <p className="text-slate-600 dark:text-slate-400">
              {totalFolders} folders • {totalFiles} files • {selectedFiles.length} selected
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-600 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - File Tree */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-96 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-4 bg-white dark:bg-slate-900"
        >
          <FileTree searchTerm={searchTerm} />
          
          {/* Execute Button Below Tree */}
          <AnimatePresence>
            {selectedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-4 sticky bottom-0 bg-white dark:bg-slate-900 pt-4 border-t border-slate-200 dark:border-slate-800"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRunTests}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg shadow-violet-600/30 transition-all"
                >
                  <Play className="w-5 h-5" fill="currentColor" />
                  <span>Execute {selectedFiles.length} Test{selectedFiles.length > 1 ? 's' : ''}</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
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
    </div>
  );
}
