import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, Circle, Trash2, Plus, Clock, RefreshCw, 
  AlertCircle, Sparkles, Check, X, Search, Edit2, 
  ArrowUpDown, LogOut, User as UserIcon, Lock, Mail, ArrowRight,
  ListTodo, CheckCheck, TrendingUp, Calendar, Eye, EyeOff,
  Briefcase, ShoppingCart, BookOpen, Heart, Tag, Layers,
  LayoutList, FolderKanban
} from 'lucide-react';

const getInitialApiUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return 'http://localhost:5000';
};

export const CATEGORIES = [
  { 
    id: 'work', 
    label: 'การงาน', 
    icon: Briefcase, 
    colorName: 'indigo',
    bgLight: 'bg-indigo-50', 
    textDark: 'text-indigo-700', 
    borderLight: 'border-indigo-200/80', 
    dotBg: 'bg-indigo-500',
    ringActive: 'ring-indigo-400',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
  },
  { 
    id: 'personal', 
    label: 'ส่วนตัว', 
    icon: UserIcon, 
    colorName: 'emerald',
    bgLight: 'bg-emerald-50', 
    textDark: 'text-emerald-700', 
    borderLight: 'border-emerald-200/80', 
    dotBg: 'bg-emerald-500',
    ringActive: 'ring-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
  },
  { 
    id: 'study', 
    label: 'การเรียน', 
    icon: BookOpen, 
    colorName: 'purple',
    bgLight: 'bg-purple-50', 
    textDark: 'text-purple-700', 
    borderLight: 'border-purple-200/80', 
    dotBg: 'bg-purple-500',
    ringActive: 'ring-purple-400',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/80'
  },
  { 
    id: 'shopping', 
    label: 'ช้อปปิ้ง', 
    icon: ShoppingCart, 
    colorName: 'amber',
    bgLight: 'bg-amber-50', 
    textDark: 'text-amber-700', 
    borderLight: 'border-amber-200/80', 
    dotBg: 'bg-amber-500',
    ringActive: 'ring-amber-400',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80'
  },
  { 
    id: 'health', 
    label: 'สุขภาพ', 
    icon: Heart, 
    colorName: 'rose',
    bgLight: 'bg-rose-50', 
    textDark: 'text-rose-700', 
    borderLight: 'border-rose-200/80', 
    dotBg: 'bg-rose-500',
    ringActive: 'ring-rose-400',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80'
  },
  { 
    id: 'general', 
    label: 'ทั่วไป', 
    icon: Tag, 
    colorName: 'slate',
    bgLight: 'bg-slate-100', 
    textDark: 'text-slate-700', 
    borderLight: 'border-slate-200/80', 
    dotBg: 'bg-slate-400',
    ringActive: 'ring-slate-400',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200/80'
  }
];

const CATEGORY_MAP = CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat;
  return acc;
}, {});

const getCategoryInfo = (catId) => CATEGORY_MAP[catId] || CATEGORY_MAP['general'];

const INITIAL_DEMO_TODOS = [
  {
    _id: 'task-1',
    text: 'ออกแบบ UI Todo List ใหม่ในธีมสีสว่าง 🎨',
    category: 'work',
    completed: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    _id: 'task-2',
    text: 'นำปุ่ม Setting และการตั้งค่าที่ไม่จำเป็นออก ✨',
    category: 'work',
    completed: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: 'task-3',
    text: 'วางแผนเป้าหมายประจำสัปดาห์และประชุมทีม 🚀',
    category: 'work',
    completed: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: 'task-4',
    text: 'อ่านบทความเรื่อง Modern Clean Design System 📚',
    category: 'study',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 0.8).toISOString()
  },
  {
    _id: 'task-5',
    text: 'ซื้อเมล็ดกาแฟและผลไม้สดสำหรับสัปดาห์นี้ ☕',
    category: 'shopping',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString()
  },
  {
    _id: 'task-6',
    text: 'ออกกำลังกายช่วงเย็น 30 นาที และดื่มน้ำให้เพียงพอ 🏃',
    category: 'health',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  // Auth State
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('taskflow_user') || null);
  const [isAuthMode, setIsAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Todo State
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('taskflow_local_todos');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        // Ensure every existing todo has a category fallback
        return parsed.map((t) => ({ ...t, category: t.category || 'general' }));
      } catch { /* ignore */ }
    }
    return INITIAL_DEMO_TODOS;
  });
  const [newTodoText, setNewTodoText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('work');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'work' | ...
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grouped'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'category' | 'az' | 'za' | 'status'
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingCategory, setEditingCategory] = useState('general');
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  // Network State
  const [apiUrl] = useState(getInitialApiUrl);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Keep local cache updated for offline resilience
  useEffect(() => {
    try {
      localStorage.setItem('taskflow_local_todos', JSON.stringify(todos));
    } catch {
      // Ignore storage errors
    }
  }, [todos]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);

    const endpoint = isAuthMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, '')}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'การเข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูล');
      }

      setToken(data.token);
      setCurrentUser(data.email || authEmail);
      localStorage.setItem('taskflow_token', data.token);
      localStorage.setItem('taskflow_user', data.email || authEmail);
      setAuthPassword('');
      setAuthEmail('');
      setIsConnected(true);
    } catch (err) {
      if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
        setAuthError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ (คุณสามารถกด "เข้าใช้งานแบบ Guest" ด้านล่างเพื่อทดลองใช้งานได้ทันที)');
      } else {
        setAuthError(err.message);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestToken = 'demo-guest-token-' + Date.now();
    const guestEmail = 'guest@taskflow.io';
    setToken(guestToken);
    setCurrentUser(guestEmail);
    localStorage.setItem('taskflow_token', guestToken);
    localStorage.setItem('taskflow_user', guestEmail);
    if (todos.length === 0) {
      setTodos(INITIAL_DEMO_TODOS);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  };

  const fetchTodos = async (targetUrl = apiUrl) => {
    if (!token) return;
    if (token.startsWith('demo-guest-token-')) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${targetUrl.replace(/\/$/, '')}/api/todos`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (response.status === 401) {
        handleLogout();
        throw new Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
      }

      if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลได้');

      const data = await response.json();
      setTodos(data.map((item) => ({ ...item, category: item.category || 'general' })));
      setIsConnected(true);
    } catch (err) {
      console.warn('Backend connection issue:', err.message);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTodos(apiUrl);
  }, [apiUrl, token]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    const trimmed = newTodoText.trim();
    if (!trimmed) return;

    const chosenCategory = selectedCategory || (categoryFilter !== 'all' ? categoryFilter : 'work');
    const tempId = `local-${Date.now()}`;
    const newTodo = { 
      _id: tempId, 
      text: trimmed, 
      category: chosenCategory,
      completed: false, 
      createdAt: new Date().toISOString() 
    };
    setTodos((prev) => [newTodo, ...prev]);
    setNewTodoText('');

    if (token && !token.startsWith('demo-guest-token-')) {
      try {
        const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/todos`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ text: trimmed, category: chosenCategory }),
        });

        if (response.status === 401) return handleLogout();
        if (!response.ok) throw new Error('Server create failed');
        
        const savedTodo = await response.json();
        setTodos((prev) => prev.map((t) => (t._id === tempId ? { ...savedTodo, category: savedTodo.category || chosenCategory } : t)));
        setIsConnected(true);
      } catch (err) {
        console.warn('Saved locally (server not reachable):', err);
        setIsConnected(false);
      }
    }
  };

  const handleToggleTodo = async (todo) => {
    const updatedStatus = !todo.completed;
    setTodos((prev) => prev.map((t) => (t._id === todo._id ? { ...t, completed: updatedStatus } : t)));

    if (token && !token.startsWith('demo-guest-token-')) {
      try {
        const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/todos/${todo._id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ completed: updatedStatus }),
        });
        if (response.status === 401) handleLogout();
      } catch (err) {
        console.warn('Updated locally:', err);
      }
    }
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo._id);
    setEditingText(todo.text);
    setEditingCategory(todo.category || 'general');
  };

  const handleSaveEdit = async (id) => {
    const trimmed = editingText.trim();
    if (!trimmed) return;

    setTodos((prev) => prev.map((t) => t._id === id ? { ...t, text: trimmed, category: editingCategory, updatedAt: new Date().toISOString() } : t));
    setEditingId(null);

    if (token && !token.startsWith('demo-guest-token-')) {
      try {
        const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/todos/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ text: trimmed, category: editingCategory }),
        });
        if (response.status === 401) handleLogout();
        if (!response.ok) throw new Error('Update failed');
      } catch (err) {
        console.warn('Edit saved locally:', err);
      }
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const targetId = deleteCandidate._id;
    setTodos((prev) => prev.filter((t) => t._id !== targetId));
    setDeleteCandidate(null);

    if (token && !token.startsWith('demo-guest-token-')) {
      try {
        const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/todos/${targetId}`, {
          method: 'DELETE',
          headers: getHeaders(),
        });
        if (response.status === 401) handleLogout();
      } catch (err) {
        console.warn('Deleted locally:', err);
      }
    }
  };

  const handleClearCompleted = () => {
    const completedIds = todos.filter(t => t.completed).map(t => t._id);
    if (completedIds.length === 0) return;
    
    setTodos(prev => prev.filter(t => !t.completed));

    if (token && !token.startsWith('demo-guest-token-')) {
      completedIds.forEach(async (id) => {
        try {
          await fetch(`${apiUrl.replace(/\/$/, '')}/api/todos/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
          });
        } catch { /* ignore */ }
      });
    }
  };

  const formatDateTime = (isoDate) => {
    if (!isoDate) return '';
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch { return ''; }
  };

  // Stats calculation
  const totalCount = todos.length;
  const completedCount = useMemo(() => todos.filter(t => t.completed).length, [todos]);
  const activeCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: todos.length };
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = todos.filter((t) => (t.category || 'general') === cat.id).length;
    });
    return counts;
  }, [todos]);

  // Filter & Sort
  const filteredTodos = useMemo(() => {
    const result = todos.filter((todo) => {
      const todoCat = todo.category || 'general';
      const matchesCategory = categoryFilter === 'all' || todoCat === categoryFilter;
      const matchesFilter = filter === 'all' ? true : filter === 'active' ? !todo.completed : todo.completed;
      const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesFilter && matchesSearch;
    });

    return [...result].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      if (sortBy === 'category') {
        const catA = a.category || 'general';
        const catB = b.category || 'general';
        return catA.localeCompare(catB);
      }
      if (sortBy === 'az') return a.text.localeCompare(b.text, 'th', { sensitivity: 'base' });
      if (sortBy === 'za') return b.text.localeCompare(a.text, 'th', { sensitivity: 'base' });
      if (sortBy === 'status') return Number(a.completed) - Number(b.completed);
      return 0;
    });
  }, [todos, filter, categoryFilter, searchQuery, sortBy]);

  // Grouped by Category for Grouped View
  const groupedTodos = useMemo(() => {
    const groups = {};
    CATEGORIES.forEach((cat) => {
      groups[cat.id] = [];
    });
    filteredTodos.forEach((todo) => {
      const c = todo.category || 'general';
      if (!groups[c]) groups[c] = [];
      groups[c].push(todo);
    });
    return groups;
  }, [filteredTodos]);

  // Today formatted
  const todayFormatted = useMemo(() => {
    return new Intl.DateTimeFormat('th-TH', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  }, []);

  // Render individual todo card
  const renderTodoCard = (todo) => {
    const formattedDate = formatDateTime(todo.createdAt || todo.timestamp);
    const isEditing = editingId === todo._id;
    const catInfo = getCategoryInfo(todo.category);
    const CategoryIcon = catInfo.icon;

    return (
      <div
        key={todo._id}
        className={`group flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 animate-fade-in-scale ${
          todo.completed
            ? 'bg-slate-50/70 border-slate-200/70'
            : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5'
        }`}
      >
        {/* Custom Interactive Checkbox */}
        <button
          onClick={() => handleToggleTodo(todo)}
          disabled={isEditing}
          type="button"
          className={`mt-0.5 rounded-full transition-all shrink-0 cursor-pointer ${
            todo.completed
              ? 'text-emerald-500'
              : 'text-slate-300 hover:text-indigo-600 hover:scale-105'
          }`}
        >
          {todo.completed ? (
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          ) : (
            <Circle className="w-5 h-5 stroke-[2]" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {isEditing ? (
            <div className="flex flex-col gap-2.5">
              <input
                type="text"
                autoFocus
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit(todo._id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                className="w-full bg-slate-50 border border-indigo-400 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:ring-3 focus:ring-indigo-100 font-medium"
              />
              
              {/* Category picker during edit */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-500">หมวดหมู่:</span>
                {CATEGORIES.map((cat) => {
                  const IconComp = cat.icon;
                  const isCurrent = editingCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setEditingCategory(cat.id)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isCurrent
                          ? `${cat.bgLight} ${cat.textDark} border border-current shadow-2xs ring-1 ${cat.ringActive}`
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <IconComp className="w-2.5 h-2.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] text-slate-400">
                กด Enter หรือเครื่องหมายถูกเพื่อบันทึก • Esc เพื่อยกเลิก
              </span>
            </div>
          ) : (
            <p
              onDoubleClick={() => !todo.completed && handleStartEdit(todo)}
              className={`text-sm sm:text-base leading-relaxed break-words transition-all ${
                todo.completed
                  ? 'line-through text-slate-400 font-normal'
                  : 'text-slate-800 font-medium'
              }`}
            >
              {todo.text}
            </p>
          )}

          {/* Metadata: Category Badge + Timestamp + Status */}
          {!isEditing && (
            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              {/* Category Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-semibold border ${catInfo.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${catInfo.dotBg}`} />
                <CategoryIcon className="w-3 h-3" />
                <span>{catInfo.label}</span>
              </span>

              {formattedDate && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{formattedDate}</span>
                </div>
              )}

              {todo.updatedAt && (
                <span className="text-slate-400 italic">(แก้ไขแล้ว)</span>
              )}

              {todo.completed && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  <CheckCheck className="w-2.5 h-2.5" /> เสร็จสิ้น
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={() => handleSaveEdit(todo._id)}
                title="บันทึก"
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={() => setEditingId(null)}
                title="ยกเลิก"
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {!todo.completed && (
                <button
                  onClick={() => handleStartEdit(todo)}
                  title="แก้ไขข้อความและหมวดหมู่"
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition opacity-70 group-hover:opacity-100 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setDeleteCandidate(todo)}
                title="ลบรายการ"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition opacity-70 group-hover:opacity-100 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // AUTH VIEW (LIGHT THEME, NO SETTINGS)
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/40 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden text-slate-800">
        <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/35 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/90 p-8 sm:p-10 rounded-3xl shadow-xl shadow-indigo-500/5 relative z-10 animate-fade-in-scale">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center text-white mb-4 transition-transform hover:scale-105 duration-300">
              <ListTodo className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              TaskFlow
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              จัดการทุกเป้าหมายของคุณด้วยความเรียบง่ายและเป็นระเบียบ
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setIsAuthMode('login'); setAuthError(''); }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                isAuthMode === 'login'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              เข้าสู่ระบบ
            </button>
            <button
              type="button"
              onClick={() => { setIsAuthMode('register'); setAuthError(''); }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                isAuthMode === 'register'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              สร้างบัญชีใหม่
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            {authError && (
              <div className="bg-rose-50 border border-rose-200/80 text-rose-700 text-xs sm:text-sm p-3.5 rounded-2xl flex items-start gap-2.5 animate-fade-in-scale">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 ml-1">
                อีเมล
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 ml-1">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="mt-2 w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white rounded-xl py-3.5 text-sm font-semibold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isAuthLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>กำลังดำเนินการ...</span>
                </>
              ) : (
                <>
                  <span>{isAuthMode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียนใช้งาน'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Divider */}
          <div className="mt-7 pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
            <span className="text-xs text-slate-400">หรือต้องการทดลองใช้งานทันที?</span>
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>เข้าใช้งานแบบ Guest (ทดลองใช้ไม่ต้องล็อกอิน)</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-400 text-center">
          TaskFlow • Modern Productivity Experience
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN VIEW (LIGHT THEME, WITH CATEGORY MANAGEMENT)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/70 to-indigo-50/30 text-slate-800 flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6 relative">
      {/* Decorative ambient subtle light glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[300px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[350px] bg-purple-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <main className="w-full max-w-3xl flex flex-col gap-6">
        
        {/* ================= HEADER ================= */}
        <header className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm shadow-slate-200/50 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo & Greeting */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 rounded-2xl shadow-md shadow-indigo-500/20 flex items-center justify-center text-white shrink-0">
                <ListTodo className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  TaskFlow
                </h1>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{todayFormatted}</span>
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => fetchTodos(apiUrl)}
                title="รีเฟรชข้อมูล"
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-indigo-600 transition shadow-2xs cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
              </button>

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              {/* User Badge */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl py-1.5 px-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                  {currentUser ? currentUser[0] : 'U'}
                </div>
                <div className="flex flex-col pr-1 hidden sm:flex max-w-[130px]">
                  <span className="text-xs font-semibold text-slate-800 truncate" title={currentUser}>
                    {currentUser}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    พร้อมใช้งาน
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="ออกจากระบบ"
                  className="p-1.5 ml-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </header>

        {/* ================= PRODUCTIVITY PROGRESS OVERVIEW CARD ================= */}
        <section className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm shadow-slate-200/50 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>ภาพรวมความคืบหน้า</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {progressPercent === 100 && totalCount > 0
                  ? 'ยอดเยี่ยมมาก! งานทั้งหมดเสร็จสิ้นแล้ว 🎉'
                  : totalCount === 0
                  ? 'ยังไม่มีงานที่บันทึกไว้ เริ่มต้นสร้างงานใหม่ได้เลย ✨'
                  : `ทำสำเร็จแล้ว ${completedCount} จาก ${totalCount} งาน`}
              </h2>
            </div>
            
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
              <span className="text-2xl font-black text-indigo-600">{progressPercent}%</span>
              <span className="text-xs text-slate-400 font-medium self-end mb-1">เสร็จสมบูรณ์</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quick Counter Pills */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3 flex flex-col items-center sm:items-start">
              <span className="text-[11px] font-semibold text-slate-500">ทั้งหมด</span>
              <span className="text-xl font-bold text-slate-900 mt-0.5">{totalCount}</span>
            </div>
            <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-3 flex flex-col items-center sm:items-start">
              <span className="text-[11px] font-semibold text-amber-700">กำลังทำ</span>
              <span className="text-xl font-bold text-amber-900 mt-0.5">{activeCount}</span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-3 flex flex-col items-center sm:items-start">
              <span className="text-[11px] font-semibold text-emerald-700">เสร็จแล้ว</span>
              <span className="text-xl font-bold text-emerald-900 mt-0.5">{completedCount}</span>
            </div>
          </div>
        </section>

        {/* ================= ADD TODO FORM (WITH CATEGORY SELECTOR) ================= */}
        <section className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-md shadow-indigo-500/5 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
          <form onSubmit={handleAddTodo} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="pl-1 text-slate-400">
                <Sparkles className="w-5 h-5 text-indigo-500" />
              </div>
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="คุณต้องการทำอะไรในวันนี้? (พิมพ์งานที่ต้องทำ)..."
                className="flex-1 bg-transparent px-2 py-2 text-slate-800 placeholder-slate-400 text-sm sm:text-base outline-none font-medium"
              />
              <button
                type="submit"
                disabled={!newTodoText.trim()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white font-semibold text-sm flex items-center gap-2 shadow-md shadow-indigo-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">เพิ่มงาน</span>
              </button>
            </div>

            {/* Quick Category Selection Pills */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                หมวดหมู่:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {CATEGORIES.map((cat) => {
                  const IconComp = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? `${cat.bgLight} ${cat.textDark} border border-current shadow-xs ring-2 ${cat.ringActive}`
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${cat.dotBg}`} />
                      <IconComp className="w-3 h-3" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        </section>

        {/* ================= CATEGORY TABS & VIEW TOGGLE ================= */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>แบ่งตามหมวดหมู่</span>
            </span>

            {/* View Mode Toggle (List vs Grouped by Category) */}
            <div className="flex items-center p-1 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="มุมมองรายการ"
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">รายการ</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                title="มุมมองจัดกลุ่มตามหมวดหมู่"
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grouped'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">จัดกลุ่ม</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills (Scrollable horizontally) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                categoryFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ทุกหมวดหมู่</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                categoryFilter === 'all' ? 'bg-indigo-700/60 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {categoryCounts.all}
              </span>
            </button>

            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isActive = categoryFilter === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(isActive ? 'all' : cat.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? `${cat.bgLight} ${cat.textDark} border border-current shadow-xs font-bold ring-2 ${cat.ringActive}`
                      : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${cat.dotBg}`} />
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/80 shadow-xs' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= CONTROLS & FILTER BAR (STATUS / SORT / SEARCH) ================= */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Status Filter Pills */}
          <div className="flex items-center p-1 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>ทั้งหมด</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === 'all' ? 'bg-indigo-700/60 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {totalCount}
              </span>
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                filter === 'active'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>กำลังทำ</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === 'active' ? 'bg-indigo-700/60 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {activeCount}
              </span>
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                filter === 'completed'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>เสร็จแล้ว</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === 'completed' ? 'bg-indigo-700/60 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {completedCount}
              </span>
            </button>
          </div>

          {/* Right Toolbar: Sort & Search */}
          <div className="flex items-center gap-2.5 flex-1 sm:justify-end">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-2xl px-3 py-2 text-xs text-slate-600 hover:border-slate-300 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-700 text-xs font-medium outline-none cursor-pointer pr-1"
              >
                <option value="newest">ล่าสุดก่อน</option>
                <option value="oldest">เก่าสุดก่อน</option>
                <option value="category">เรียงตามหมวดหมู่</option>
                <option value="az">เรียงตาม ก - ฮ</option>
                <option value="za">เรียงตาม ฮ - ก</option>
                <option value="status">งานที่ยังไม่เสร็จก่อน</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-[210px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหางาน..."
                className="w-full bg-white border border-slate-200/90 rounded-2xl pl-8 pr-7 py-2 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Clear Completed (Bulk) */}
            {completedCount > 0 && (
              <button
                type="button"
                onClick={handleClearCompleted}
                title="ลบงานที่เสร็จแล้วทั้งหมด"
                className="p-2 rounded-2xl bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition shadow-2xs text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">ล้างที่เสร็จแล้ว</span>
              </button>
            )}
          </div>
        </section>

        {/* ================= TODO LIST (LIST VIEW OR GROUPED VIEW) ================= */}
        <section className="flex flex-col gap-4">
          {filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/70 border-2 border-dashed border-slate-200 rounded-3xl text-center">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-3.5 shadow-2xs">
                {searchQuery ? <Search className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {searchQuery ? 'ไม่พบรายการที่ตรงกับการค้นหา' : 'ไม่มีรายการงาน'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {searchQuery 
                  ? `ไม่พบคำว่า "${searchQuery}" ลองค้นหาด้วยคำอื่นดูนะ` 
                  : categoryFilter !== 'all'
                  ? `ยังไม่มีงานในหมวดหมู่ "${getCategoryInfo(categoryFilter).label}"`
                  : filter === 'completed' 
                  ? 'ยังไม่มีงานที่ทำเสร็จในหมวดหมู่นี้' 
                  : 'เริ่มต้นวันของคุณด้วยการเพิ่มงานใหม่ด้านบนได้เลย!'}
              </p>
            </div>
          ) : viewMode === 'list' ? (
            <div className="flex flex-col gap-3">
              {filteredTodos.map((todo) => renderTodoCard(todo))}
            </div>
          ) : (
            /* GROUPED VIEW: Render by Category Groups */
            <div className="flex flex-col gap-6">
              {CATEGORIES
                .filter((cat) => categoryFilter === 'all' || categoryFilter === cat.id)
                .map((cat) => {
                  const catTodos = groupedTodos[cat.id] || [];
                  if (catTodos.length === 0 && (categoryFilter !== 'all' || searchQuery || filter !== 'all')) {
                    return null;
                  }
                  const catCompleted = catTodos.filter((t) => t.completed).length;
                  const CatIcon = cat.icon;

                  return (
                    <div key={cat.id} className="flex flex-col gap-3">
                      {/* Category Header */}
                      <div className="flex items-center justify-between px-2 pt-1">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-xl ${cat.bgLight} ${cat.textDark} border ${cat.borderLight} shadow-2xs`}>
                            <CatIcon className="w-4 h-4" />
                          </div>
                          <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                            <span>{cat.label}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                              {catTodos.length}
                            </span>
                          </h3>
                        </div>

                        {catTodos.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-medium">
                              {catCompleted}/{catTodos.length} สำเร็จ
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Category Items */}
                      <div className="flex flex-col gap-2.5">
                        {catTodos.length === 0 ? (
                          <div className="py-4 px-4 rounded-2xl border border-dashed border-slate-200/80 text-center text-xs text-slate-400 bg-white/40">
                            ยังไม่มีงานในหมวดหมู่นี้
                          </div>
                        ) : (
                          catTodos.map((todo) => renderTodoCard(todo))
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </section>

      </main>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in-scale">
          <div className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-slate-900 text-lg">
                ยืนยันการลบรายการ?
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 px-2">
                ต้องการลบ "{deleteCandidate.text}" ออกจากรายการของคุณใช่หรือไม่?
              </p>
            </div>

            <div className="flex gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20 transition cursor-pointer"
              >
                ลบรายการ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}