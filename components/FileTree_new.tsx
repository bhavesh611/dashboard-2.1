'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Folder, File, CheckSquare, Square, MinusSquare } from 'lucide-react';
import useStore, { FileNode } from '@/lib/state';
import { cn } from '@/lib/utils';

interface FileTreeNodeProps {
  name: string;
  node: FileNode;
  path: string;
  level: number;
}

function FileTreeNode({ name, node, path, level }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { selectedFiles, toggleSelect, selectAllInFolder, setSelectedFile } = useStore();

  const isFolder = node.type === 'folder';
  const isSelected = selectedFiles.includes(path);

  // Check if all children are selected (for folders)
  const getSelectionState = (): 'all' | 'some' | 'none' => {
    if (!isFolder || !node.children) return 'none';
    
    const childPaths: string[] = [];
    const collectPaths = (n: FileNode, p: string) => {
      if (n.type === 'file') {
        childPaths.push(p);
      } else if (n.children) {
        Object.entries(n.children).forEach(([childName, childNode]) => {
          collectPaths(childNode, `${p}/${childName}`);
        });
      }
    };
    collectPaths(node, path);

    const selectedCount = childPaths.filter(p => selectedFiles.includes(p)).length;
    if (selectedCount === 0) return 'none';
    if (selectedCount === childPaths.length) return 'all';
    return 'some';
  };

  const selectionState = isFolder ? getSelectionState() : 'none';

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      selectAllInFolder(path);
    } else {
      toggleSelect(path);
    }
  };

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
    } else {
      setSelectedFile(path);
    }
  };

  const CheckboxIcon = isFolder
    ? selectionState === 'all'
      ? CheckSquare
      : selectionState === 'some'
      ? MinusSquare
      : Square
    : isSelected
    ? CheckSquare
    : Square;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150',
          'hover:bg-slate-100 dark:hover:bg-slate-800/50 group',
          !isFolder && 'hover:translate-x-1'
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={handleClick}
      >
        {/* Expand/Collapse Icon */}
        {isFolder && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </motion.div>
        )}

        {/* Checkbox */}
        <button
          onClick={handleCheckboxClick}
          className="flex-shrink-0 hover:text-violet-400 transition-colors"
        >
          <CheckboxIcon
            className={cn(
              'w-4 h-4',
              isSelected || selectionState === 'all' || selectionState === 'some'
                ? 'text-violet-500'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400'
            )}
          />
        </button>

        {/* Icon */}
        {isFolder ? (
          <Folder className="w-4 h-4 text-violet-400 flex-shrink-0" />
        ) : (
          <File className="w-4 h-4 text-blue-400 flex-shrink-0" />
        )}

        {/* Name */}
        <span
          className={cn(
            'text-sm truncate',
            isSelected || selectionState === 'all' || selectionState === 'some'
              ? 'text-slate-900 dark:text-white font-medium'
              : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
          )}
        >
          {name}
        </span>

        {/* File count badge for folders */}
        {isFolder && node.children && (
          <span className="ml-auto text-xs text-slate-500 dark:text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {Object.keys(node.children).length}
          </span>
        )}
      </motion.div>

      {/* Children */}
      {isFolder && node.children && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {Object.entries(node.children)
                .sort(([, a], [, b]) => {
                  // Folders first, then files
                  if (a.type === 'folder' && b.type === 'file') return -1;
                  if (a.type === 'file' && b.type === 'folder') return 1;
                  return 0;
                })
                .map(([childName, childNode]) => (
                  <FileTreeNode
                    key={`${path}/${childName}`}
                    name={childName}
                    node={childNode}
                    path={`${path}/${childName}`}
                    level={level + 1}
                  />
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default function FileTree() {
  const { filesTree, selectedFiles, deselectAll } = useStore();

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Test Files
        </h3>
        {selectedFiles.length > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={deselectAll}
            className="text-xs text-violet-600 hover:text-violet-500 transition-colors"
          >
            Deselect All ({selectedFiles.length})
          </motion.button>
        )}
      </div>

      {/* Root Tree - Now showing folders with checkboxes */}
      <div className="space-y-0.5">
        {Object.entries(filesTree).map(([name, node]) => (
          <FileTreeNode
            key={name}
            name={name}
            node={node}
            path={name}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}
