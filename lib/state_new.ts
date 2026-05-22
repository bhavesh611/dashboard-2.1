import { create } from 'zustand';
import mockTestsData from '../data/mockTests.json';

export interface FileNode {
  type: 'file' | 'folder';
  content?: string;
  children?: Record<string, FileNode>;
}

export interface FilesTree {
  [key: string]: FileNode;
}

export interface ExecutionLog {
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

export interface TestCase {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  progress: number;
  duration?: number;
}

export interface ActiveExecution {
  id: string;
  files: string[];
  status: 'running' | 'completed' | 'failed';
  progress: number;
  logs: ExecutionLog[];
  testCases: TestCase[];
  startTime: string;
  endTime?: string;
  browser: string;
  headless: boolean;
}

export interface HistoryExecution {
  id: string;
  target: string;
  browser: string;
  status: 'passed' | 'failed' | 'partial';
  startTime: string;
  duration: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
}

export interface Settings {
  browser: 'chrome' | 'firefox' | 'edge' | 'safari';
  headless: boolean;
  captureScreenshots: boolean;
  captureVideos: boolean;
  autoRetry: boolean;
  maxRetries: number;
}

export interface UIState {
  selectedFile: string | null;
  sidebarCollapsed: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface State {
  filesTree: FilesTree;
  selectedFiles: string[];
  activeExecutions: ActiveExecution[];
  history: HistoryExecution[];
  settings: Settings;
  ui: UIState;
  toasts: Toast[];
  searchQuery: string;
  historyFilter: string;
  executionCounter: number; // NEW: Track execution ID
  
  // Actions
  toggleSelect: (path: string) => void;
  selectAllInFolder: (folderPath: string) => void;
  deselectAll: () => void;
  runSelectedTests: (options: { deterministic: boolean }) => void;
  streamLog: (executionId: string, log: ExecutionLog) => void;
  updateTestCase: (executionId: string, testName: string, updates: Partial<TestCase>) => void;
  completeExecution: (executionId: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setSelectedFile: (path: string | null) => void;
  toggleSidebar: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setHistoryFilter: (filter: string) => void;
  getTotalTestCases: () => number;
  clearAllHistory: () => void; // NEW: Clear history
}

const useStore = create<State>((set, get) => ({
  filesTree: mockTestsData.tests as FilesTree,
  selectedFiles: [],
  activeExecutions: [],
  toasts: [],
  searchQuery: '',
  historyFilter: '',
  history: [], // START EMPTY
  executionCounter: 1, // START FROM 1
  settings: {
    browser: 'chrome',
    headless: false,
    captureScreenshots: true,
    captureVideos: false,
    autoRetry: true,
    maxRetries: 2,
  },
  ui: {
    selectedFile: null,
    sidebarCollapsed: false,
  },

  toggleSelect: (path: string) => {
    set((state) => {
      const isSelected = state.selectedFiles.includes(path);
      return {
        selectedFiles: isSelected
          ? state.selectedFiles.filter((p) => p !== path)
          : [...state.selectedFiles, path],
      };
    });
  },

  selectAllInFolder: (folderPath: string) => {
    const collectFiles = (node: FileNode, currentPath: string): string[] => {
      if (node.type === 'file') {
        return [currentPath];
      }
      if (node.children) {
        return Object.entries(node.children).flatMap(([name, child]) =>
          collectFiles(child, `${currentPath}/${name}`)
        );
      }
      return [];
    };

    set((state) => {
      const parts = folderPath.split('/');
      let current: FileNode | undefined = state.filesTree[parts[0]];
      
      for (let i = 1; i < parts.length && current; i++) {
        current = current.children?.[parts[i]];
      }

      if (current && current.type === 'folder') {
        const files = collectFiles(current, folderPath);
        const allSelected = files.every((f) => state.selectedFiles.includes(f));
        
        if (allSelected) {
          return {
            selectedFiles: state.selectedFiles.filter((p) => !files.includes(p)),
          };
        } else {
          return {
            selectedFiles: [...new Set([...state.selectedFiles, ...files])],
          };
        }
      }
      return state;
    });
  },

  deselectAll: () => set({ selectedFiles: [] }),

  runSelectedTests: (options: { deterministic: boolean }) => {
    const { selectedFiles, settings, executionCounter } = get();
    if (selectedFiles.length === 0) return;

    const executionId = `exec-${executionCounter}`;
    
    // Count actual test cases from selected files
    const testCases: TestCase[] = [];
    selectedFiles.forEach((filePath) => {
      const parts = filePath.split('/');
      let current: FileNode | undefined = get().filesTree[parts[0]];
      
      for (let i = 1; i < parts.length && current; i++) {
        current = current.children?.[parts[i]];
      }
      
      if (current && current.type === 'file' && current.content) {
        // Count def test_ functions
        const matches = current.content.match(/def test_\w+/g);
        if (matches) {
          matches.forEach((match) => {
            testCases.push({
              name: match.replace('def ', ''),
              status: 'pending' as const,
              progress: 0,
            });
          });
        }
      }
    });

    const newExecution: ActiveExecution = {
      id: executionId,
      files: [...selectedFiles],
      status: 'running',
      progress: 0,
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Starting test execution for ${selectedFiles.length} file(s)`,
        },
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Browser: ${settings.browser.toUpperCase()} | Headless: ${settings.headless}`,
        },
      ],
      testCases,
      startTime: new Date().toISOString(),
      browser: settings.browser,
      headless: settings.headless,
    };

    set((state) => ({
      activeExecutions: [...state.activeExecutions, newExecution],
      executionCounter: state.executionCounter + 1, // INCREMENT COUNTER
    }));

    // Simulate test execution
    setTimeout(() => {
      get().streamLog(executionId, {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Initializing WebDriver...',
      });
    }, 500);

    setTimeout(() => {
      get().streamLog(executionId, {
        timestamp: new Date().toISOString(),
        level: 'success',
        message: 'WebDriver initialized successfully',
      });
    }, 1200);

    // Run each test case
    testCases.forEach((testCase, index) => {
      const delay = 2000 + index * 3000;
      
      setTimeout(() => {
        get().updateTestCase(executionId, testCase.name, {
          status: 'running',
          progress: 0,
        });
        get().streamLog(executionId, {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Running: ${testCase.name}`,
        });
      }, delay);

      // Animate progress
      for (let i = 1; i <= 10; i++) {
        setTimeout(() => {
          get().updateTestCase(executionId, testCase.name, {
            progress: i * 10,
          });
        }, delay + i * 200);
      }

      // Complete test case
      setTimeout(() => {
        const isPassed = options.deterministic
          ? index % 2 === 0
          : Math.random() > 0.3;
        
        get().updateTestCase(executionId, testCase.name, {
          status: isPassed ? 'passed' : 'failed',
          progress: 100,
          duration: 2 + Math.random() * 2,
        });
        
        get().streamLog(executionId, {
          timestamp: new Date().toISOString(),
          level: isPassed ? 'success' : 'error',
          message: `${testCase.name}: ${isPassed ? 'PASSED' : 'FAILED'}`,
        });
      }, delay + 2500);
    });

    // Complete execution
    const totalDuration = 2000 + testCases.length * 3000 + 3000;
    setTimeout(() => {
      get().completeExecution(executionId);
    }, totalDuration);
  },

  streamLog: (executionId: string, log: ExecutionLog) => {
    set((state) => ({
      activeExecutions: state.activeExecutions.map((exec) =>
        exec.id === executionId
          ? { ...exec, logs: [...exec.logs, log] }
          : exec
      ),
    }));
  },

  updateTestCase: (executionId: string, testName: string, updates: Partial<TestCase>) => {
    set((state) => ({
      activeExecutions: state.activeExecutions.map((exec) => {
        if (exec.id !== executionId) return exec;
        
        const updatedTestCases = exec.testCases.map((tc) =>
          tc.name === testName ? { ...tc, ...updates } : tc
        );
        
        const totalProgress = updatedTestCases.reduce((sum, tc) => sum + tc.progress, 0) / updatedTestCases.length;
        
        return {
          ...exec,
          testCases: updatedTestCases,
          progress: Math.round(totalProgress),
        };
      }),
    }));
  },

  completeExecution: (executionId: string) => {
    set((state) => {
      const execution = state.activeExecutions.find((e) => e.id === executionId);
      if (!execution) return state;

      const passedCount = execution.testCases.filter((tc) => tc.status === 'passed').length;
      const failedCount = execution.testCases.filter((tc) => tc.status === 'failed').length;
      const totalCount = execution.testCases.length;
      
      let finalStatus: 'passed' | 'failed' | 'partial';
      if (failedCount === 0) finalStatus = 'passed';
      else if (passedCount === 0) finalStatus = 'failed';
      else finalStatus = 'partial';

      const endTime = new Date();
      const startTime = new Date(execution.startTime);
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationStr = `${Math.floor(durationMs / 60000)}m ${Math.floor((durationMs % 60000) / 1000)}s`;

      const historyEntry: HistoryExecution = {
        id: execution.id,
        target: execution.files.join(', '),
        browser: execution.browser.charAt(0).toUpperCase() + execution.browser.slice(1),
        status: finalStatus,
        startTime: new Date(execution.startTime).toLocaleString(),
        duration: durationStr,
        totalTests: totalCount,
        passedTests: passedCount,
        failedTests: failedCount,
      };

      const updatedExecutions = state.activeExecutions.map((exec) =>
        exec.id === executionId
          ? {
              ...exec,
              status: 'completed' as const,
              progress: 100,
              endTime: endTime.toISOString(),
              logs: [
                ...exec.logs,
                {
                  timestamp: endTime.toISOString(),
                  level: 'success' as const,
                  message: `Execution completed: ${passedCount}/${totalCount} passed`,
                },
              ],
            }
          : exec
      );

      return {
        activeExecutions: updatedExecutions,
        history: [historyEntry, ...state.history],
      };
    });
  },

  updateSettings: (newSettings: Partial<Settings>) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  setSelectedFile: (path: string | null) => {
    set((state) => ({
      ui: { ...state.ui, selectedFile: path },
    }));
  },

  toggleSidebar: () => {
    set((state) => ({
      ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed },
    }));
  },

  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setHistoryFilter: (filter: string) => {
    set({ historyFilter: filter });
  },

  getTotalTestCases: () => {
    const countTestCases = (node: FileNode): number => {
      if (node.type === 'file' && node.content) {
        // Count def test_ patterns in Python files
        const matches = node.content.match(/def test_\w+/g);
        return matches ? matches.length : 0;
      }
      if (node.type === 'folder' && node.children) {
        return Object.values(node.children).reduce((sum, child) => sum + countTestCases(child), 0);
      }
      return 0;
    };

    const { filesTree } = get();
    return Object.values(filesTree).reduce((sum, node) => sum + countTestCases(node), 0);
  },

  clearAllHistory: () => {
    set({
      history: [],
      activeExecutions: [],
      executionCounter: 1,
    });
  },
}));

export default useStore;
