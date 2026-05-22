'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Play, FileCode2, Copy, Check } from 'lucide-react';
import useStore, { FileNode } from '@/lib/state';

export default function CodeViewer() {
  const { ui, filesTree, toggleSelect, selectedFiles, addToast } = useStore();
  const [copied, setCopied] = useState(false);
  const selectedFile = ui.selectedFile;

  // Get file content
  const getFileContent = (): { content: string; fileName: string; testCount: number } | null => {
    if (!selectedFile) return null;

    const parts = selectedFile.split('/');
    let current: FileNode | undefined = filesTree[parts[0]];

    for (let i = 1; i < parts.length && current; i++) {
      current = current.children?.[parts[i]];
    }

    if (current && current.type === 'file' && current.content) {
      // Count tests
      const matches = current.content.match(/def test_\\w+/g);
      const testCount = matches ? matches.length : 0;
      
      return {
        content: current.content,
        fileName: parts[parts.length - 1],
        testCount,
      };
    }

    return null;
  };

  const fileData = getFileContent();
  const isSelected = selectedFile ? selectedFiles.includes(selectedFile) : false;

  const handleCopy = () => {
    if (fileData) {
      navigator.clipboard.writeText(fileData.content);
      setCopied(true);
      addToast({
        type: 'success',
        message: 'Code copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRunSingle = () => {
    if (selectedFile && !isSelected) {
      toggleSelect(selectedFile);
      addToast({
        type: 'info',
        message: `Added ${fileData?.fileName} to selection`,
      });
    }
  };

  if (!fileData) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FileCode2 className="w-20 h-20 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          </motion.div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Select a file to view its content</p>
        </motion.div>
      </div>
    );
  }

  // Custom style for VS Code-like appearance
  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: '#1e1e1e',
      margin: 0,
      padding: '1rem',
      fontSize: '0.875rem',
      lineHeight: '1.5',
    },
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: '#1e1e1e',
      fontSize: '0.875rem',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center"
          >
            <FileCode2 className="w-4 h-4 text-blue-500" />
          </motion.div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{fileData.fileName}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {fileData.testCount} test case{fileData.testCount !== 1 ? 's' : ''} • {fileData.content.split('\\n').length} lines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </motion.button>

          {/* Run Single File Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRunSingle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
              isSelected
                ? 'bg-green-600/20 text-green-600 dark:text-green-400 border border-green-600/50'
                : 'bg-violet-600 hover:bg-violet-700 text-white'
            }`}
          >
            <Play className="w-4 h-4" fill={isSelected ? 'none' : 'currentColor'} />
            <span>{isSelected ? 'Selected' : 'Add to Queue'}</span>
          </motion.button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter
          language="python"
          style={customStyle}
          showLineNumbers
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: '#858585',
            textAlign: 'right',
            userSelect: 'none',
          }}
          customStyle={{
            margin: 0,
            background: '#1e1e1e',
            height: '100%',
          }}
        >
          {fileData.content}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  );
}
