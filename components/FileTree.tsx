'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  FolderOpen, 
  Folder,
  FileCode2,
  CheckSquare, 
  Square, 
  MinusSquare 
} from 'lucide-react';
import useStore, { FileNode } from '@/lib/state';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  searchTerm?: string;
}

interface FileTreeNodeProps {
  name: string;
  node: FileNode;
  path: string;
  level: number;
  searchTerm?: string;
}

function FileTreeNode({ name, node, path, level, searchTerm }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { selectedFiles, toggleSelect, selectAllInFolder, setSelectedFile } = useStore();

  const isFolder = node.type === 'folder';
  const isSelected = selectedFiles.includes(path);

  // Search filter
  const matchesSearch = !searchTerm || name.toLowerCase().includes(searchTerm.toLowerCase());
  
  // Check if any children match search
  const hasMatchingChildren = (): boolean => {
    if (!isFolder || !node.children || !searchTerm) return false;
    
    const checkChildren = (children: Record<string, FileNode>): boolean => {
      return Object.entries(children).some(([childName, childNode]) => {
        if (childName.toLowerCase().includes(searchTerm.toLowerCase())) return true;
        if (childNode.type === 'folder' && childNode.children) {
          return checkChildren(childNode.children);
        }
        return false;
      });
    };
    
    return checkChildren(node.children);
  };

  const shouldShow = matchesSearch || hasMatchingChildren();
  
  if (!shouldShow) return null;

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

  // Count test cases in file
  const getTestCount = (): number => {
    if (node.type === 'file' && node.content) {
      const matches = node.content.match(/def test_\\w+/g);
      return matches ? matches.length : 0;
    }
    return 0;
  };

  const testCount = getTestCount();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ x: 2 }}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 group',
          'hover:bg-violet-50 dark:hover:bg-slate-800/50',
          isSelected && 'bg-violet-100 dark:bg-violet-900/20'
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
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </motion.div>
        )}

        {!isFolder && <div className="w-4" />}

        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCheckboxClick}
          className="flex-shrink-0 hover:text-violet-500 transition-colors"
        >
          <CheckboxIcon
            className={cn(
              'w-4 h-4 transition-colors',
              isSelected || selectionState === 'all' || selectionState === 'some'
                ? 'text-violet-600 dark:text-violet-500'
                : 'text-slate-400 dark:text-slate-600 group-hover:text-violet-400'
            )}
          />
        </motion.button>

        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: isFolder ? [0, -5, 5, 0] : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isFolder ? (
            isExpanded ? (
              <FolderOpen className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            ) : (
              <Folder className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            )
          ) : (
            <FileCode2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          )}
        </motion.div>

        {/* Name */}
        <span
          className={cn(
            'text-sm truncate flex-1',
            isSelected || selectionState === 'all' || selectionState === 'some'
              ? 'text-violet-700 dark:text-violet-300 font-semibold'
              : 'text-slate-700 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-400'
          )}
        >
          {name}
        </span>

        {/* Test count badge for files */}
        {!isFolder && testCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium"
          >
            {testCount} test{testCount > 1 ? 's' : ''}
          </motion.span>
        )}

        {/* File count badge for folders */}
        {isFolder && node.children && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
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
                    searchTerm={searchTerm}
                  />
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

export default function FileTree({ searchTerm }: FileTreeProps) {
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={deselectAll}
            className="text-xs px-2 py-1 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors font-medium"
          >
            Clear ({selectedFiles.length})
          </motion.button>
        )}
      </div>

      {/* Tree */}
      <div className="space-y-0.5">
        {Object.entries(filesTree).map(([name, node]) => (
          <FileTreeNode
            key={name}
            name={name}
            node={node}
            path={name}
            level={0}
            searchTerm={searchTerm}
          />
        ))}
      </div>
    </div>
  );
}
