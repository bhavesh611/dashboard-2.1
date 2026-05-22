# IQM Automation Dashboard

> **A high-fidelity, fully functional automation testing dashboard built with Next.js, TypeScript, and Tailwind CSS.**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

### 🎨 **Dual Theme System**
- **Dark Mode** (default) - Sleek slate-950 background with violet-600 accents
- **Light Mode** - Clean white background with perfect contrast
- **Persistent** - Theme choice saved to localStorage
- **Animated Toggle** - Smooth Moon/Sun icon transitions

### 🔔 **Toast Notification System**
- **4 Types**: Success, Error, Warning, Info
- **Auto-dismiss** after 3 seconds
- **Manual close** with X button
- **Stacked** - Multiple toasts supported
- **Animated** - Slide in from right with spring physics

### 📊 **Dynamic Dashboard**
- **5 Metric Cards**:
  1. Total Test Cases (counts `def test_` in all Python files)
  2. Active Executions
  3. Tests Passed
  4. Tests Failed
  5. Pass Rate
- **2 Charts**: Bar chart (Pass/Fail), Line chart (Pass Rate Trend)
- **Recent Executions**: Last 5 runs with status badges
- **All data calculated dynamically** from execution history

### 🔍 **Search & Filter**
- **Global Search** in navbar
- **Filter by Status** in History page (All/Passed/Failed/Partial)
- **Combined filtering** - Search + Status filter
- **Live count** showing "X of Y executions"
- **Clear button** to reset search

### 📁 **File Explorer**
- **Recursive File Tree** with expand/collapse
- **Three-state Checkboxes** for folders (all/some/none)
- **Root folder checkbox** visible and functional
- **VS Code-style Code Viewer** with syntax highlighting
- **Copy to clipboard** with toast notification
- **Run single file** or multiple files

### ▶️ **Active Execution**
- **Live execution queue** with pulsing "Live" indicator
- **Individual test progress bars** (0-100% animation)
- **Real-time logs** (black bg, green text, auto-scroll)
- **Status badges** (running/passed/failed)
- **View All History** button

### 📜 **History**
- **Data table** with all executions
- **Columns**: ID, Target, Browser, Status, Tests, Start Time, Duration
- **Search** by ID, target, or browser
- **Filter** by status
- **Hover effects** on rows

### ⚙️ **Settings**
- **Browser selection** (Chrome, Firefox, Edge, Safari)
- **Toggle switches**: Headless, Screenshots, Videos, Auto-Retry
- **Max retries counter** (conditional display)
- **Save button** with toast confirmation
- **Reset to defaults** button

### ✨ **Animations**
- **Staggered entrances** for cards and rows
- **Hover effects** - lift, scale, rotate
- **Progress bars** - smooth width animations
- **Spinners** - continuous rotation
- **Theme transitions** - 0.3s ease
- **Spring physics** for natural movement

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

The app uses Supabase for the fullstack backend (optional). Environment variables are pre-configured in `vercel.json`.

---

## 📦 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.1.0 | React framework with App Router |
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.3.3 | Type safety |
| **Tailwind CSS** | 3.4.1 | Styling |
| **Framer Motion** | 11.0.0 | Animations |
| **Zustand** | 4.5.0 | State management |
| **Recharts** | 2.10.0 | Data visualization |
| **react-syntax-highlighter** | 15.5.0 | Code highlighting |
| **Lucide React** | 0.263.1 | Icons |

---

## 📂 Project Structure

```
iqm-automation/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Dashboard (5 metrics, charts, recent executions)
│   ├── file-explorer/page.tsx   # File tree + code viewer
│   ├── active-execution/page.tsx # Live execution monitoring
│   ├── history/page.tsx          # Execution history table
│   ├── execution-settings/page.tsx # Settings page
│   ├── layout.tsx                # Root layout with theme provider
│   └── globals.css               # Global styles + theme variables
├── components/                   # Reusable components
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── Navbar.tsx                # Top navbar with search
│   ├── FileTree.tsx              # Recursive file tree
│   ├── CodeViewer.tsx            # VS Code-style code viewer
│   ├── EmptyState.tsx            # Empty state component
│   ├── ThemeProvider.tsx         # Theme context provider
│   ├── ThemeToggle.tsx           # Theme toggle button
│   └── Toaster.tsx               # Toast notification system
├── lib/                          # Utilities
│   ├── state.ts                  # Zustand store
│   └── utils.ts                  # Helper functions
├── data/                         # Mock data
│   └── mockTests.json            # Test file structure
└── public/                       # Static assets
    └── favicon.svg               # App icon
```

---

## 🎯 Key Features Explained

### 1. Test Case Counting

The dashboard dynamically counts test cases by parsing Python files:

```typescript
getTotalTestCases: () => {
  const countTestCases = (node: FileNode): number => {
    if (node.type === 'file' && node.content) {
      // Count def test_ patterns
      const matches = node.content.match(/def test_\\w+/g);
      return matches ? matches.length : 0;
    }
    if (node.type === 'folder' && node.children) {
      return Object.values(node.children).reduce(
        (sum, child) => sum + countTestCases(child), 
        0
      );
    }
    return 0;
  };
  // ...
}
```

### 2. Theme System

Themes are managed with React Context and persisted to localStorage:

```typescript
// Light theme
bg-white dark:bg-slate-950
text-slate-900 dark:text-white

// Dark theme (default)
bg-slate-950
text-white
```

### 3. Toast Notifications

Simple API for showing notifications:

```typescript
addToast({
  type: 'success',
  message: 'Settings saved successfully!',
  duration: 3000, // optional
});
```

### 4. Search & Filter

Combined filtering in History page:

```typescript
const filteredHistory = history.filter((exec) => {
  const matchesSearch = !searchQuery || 
    exec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exec.target.toLowerCase().includes(searchQuery.toLowerCase());
  
  const matchesFilter = statusFilter === 'all' || 
    exec.status === statusFilter;
  
  return matchesSearch && matchesFilter;
});
```

---

## 🎨 Design System

### Colors

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `white` / `slate-50` | `slate-950` |
| Cards | `white` | `slate-900` |
| Text Primary | `slate-900` | `white` |
| Text Secondary | `slate-600` | `slate-400` |
| Borders | `slate-200` | `slate-800` |
| Primary Accent | `violet-600` | `violet-600` |

### Typography

- **Headings**: Inter font, bold weights
- **Body**: Inter font, regular weight
- **Code**: Monospace, VS Code Dark Plus theme

### Spacing

- **Cards**: `p-6` (24px padding)
- **Gaps**: `gap-6` (24px between elements)
- **Rounded**: `rounded-xl` (12px border radius)

---

## 📸 Screenshots

### Dashboard (Dark Mode)
- 5 animated metric cards
- Bar and line charts
- Recent executions list

### File Explorer
- Recursive file tree with checkboxes
- VS Code-style code viewer
- Floating action button

### Active Execution
- Live execution queue
- Test case progress bars
- Real-time logs

### History
- Searchable execution table
- Status filter dropdown
- Animated row hovers

### Settings
- Browser selection grid
- Toggle switches
- Save confirmation toasts

---

## 🔧 Configuration

### Zustand Store

The app uses Zustand for global state management:

```typescript
interface State {
  filesTree: FilesTree;
  selectedFiles: string[];
  activeExecutions: ActiveExecution[];
  history: HistoryExecution[];
  settings: Settings;
  toasts: Toast[];
  searchQuery: string;
  // ... actions
}
```

### Mock Data

Test files are defined in `data/mockTests.json`:

```json
{
  "tests": {
    "Login": {
      "type": "folder",
      "children": {
        "test_login.py": {
          "type": "file",
          "content": "import pytest\\n\\ndef test_valid_login():\\n    assert True"
        }
      }
    }
  }
}
```

---

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Theme Not Persisting

Check browser localStorage:

```javascript
// In browser console
localStorage.getItem('theme')
```

### Toasts Not Showing

Ensure `<Toaster />` is included in `app/layout.tsx`.

---

## 📝 License

MIT License - feel free to use this project for your own purposes.

---

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS
- **Framer Motion** for smooth animations
- **Recharts** for beautiful charts
- **Lucide** for the icon library

---

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
