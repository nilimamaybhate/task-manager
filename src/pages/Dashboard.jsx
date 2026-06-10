import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* ─── mount animation helper ─── */
const useMount = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);
  return mounted;
};

function Dashboard() {
  const [tasks, setTasks]           = useState([]);
  const [title, setTitle]           = useState("");
  const [editingId, setEditingId]   = useState(null);
  const [editTitle, setEditTitle]   = useState("");
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [dark, setDark]             = useState(false);
  const [adding, setAdding]         = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const mounted = useMount();

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchTasks(token);
  }, []);

  /* ── theme tokens: light = Sky Frost, dark = Deep Ocean ── */
  const t = dark ? {
    page        : "bg-[#060d1f]",
    blob1       : "bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.18),transparent_60%)]",
    blob2       : "bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.15),transparent_60%)]",
    text        : "text-[#e0f2fe]",
    subtext     : "text-[#2d6b8a]",
    card        : "bg-[rgba(56,189,248,0.06)] border border-[rgba(56,189,248,0.12)]",
    cardHover   : "hover:border-[rgba(56,189,248,0.3)] hover:bg-[rgba(56,189,248,0.09)]",
    input       : "bg-[rgba(56,189,248,0.06)] border border-[rgba(56,189,248,0.15)] text-[#e0f2fe] placeholder-[#2d6b8a] focus:border-[rgba(56,189,248,0.45)]",
    statBase    : "bg-[rgba(56,189,248,0.07)] border border-[rgba(56,189,248,0.12)]",
    statAccent  : "bg-gradient-to-br from-[#0ea5e9] to-[#6366f1]",
    statNum     : "text-[#7dd3fc]",
    statNumAcc  : "text-white",
    statLbl     : "text-[#2d6b8a]",
    statLblAcc  : "text-[rgba(255,255,255,0.6)]",
    progressBg  : "bg-[rgba(56,189,248,0.1)]",
    progressBar : "from-[#38bdf8] to-[#6366f1]",
    pillActive  : "bg-[#0ea5e9] text-white border-[#0ea5e9]",
    pillInactive: "bg-transparent text-[#2d6b8a] border-[rgba(56,189,248,0.2)] hover:border-[rgba(56,189,248,0.5)]",
    taskTitle   : "text-[#e0f2fe]",
    taskDone    : "text-[#2d6b8a]",
    taskDot     : "bg-gradient-to-br from-[#38bdf8] to-[#6366f1]",
    checkOff    : "border-[rgba(56,189,248,0.35)]",
    checkOn     : "bg-gradient-to-br from-[#0ea5e9] to-[#6366f1]",
    editInput   : "border-b border-[rgba(56,189,248,0.4)] text-[#e0f2fe]",
    actionBtn   : "bg-[rgba(56,189,248,0.07)] border border-[rgba(56,189,248,0.15)] hover:border-[rgba(56,189,248,0.4)]",
    iconEdit    : "#7dd3fc",
    iconDel     : "#f87171",
    saveBtn     : "bg-gradient-to-r from-[#0ea5e9] to-[#6366f1] text-white",
    divider     : "border-[rgba(56,189,248,0.1)]",
    logoutText  : "text-[#2d6b8a] hover:text-[#7dd3fc]",
    avatar      : "bg-gradient-to-br from-[#0ea5e9] to-[#6366f1]",
    toggleBg    : "bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)]",
    toggleIcon  : "text-[#7dd3fc]",
    label       : "text-[#2d6b8a]",
    addBtn      : "bg-gradient-to-r from-[#0ea5e9] to-[#6366f1] text-white shadow-[0_4px_14px_rgba(14,165,233,0.35)]",
    emptyText   : "text-[#2d6b8a]",
    nameColor   : "text-[#38bdf8]",
    shape1      : "border-[rgba(56,189,248,0.08)]",
    shape2      : "border-[rgba(99,102,241,0.06)]",
  } : {
    page        : "bg-[#f0f9ff]",
    blob1       : "bg-[radial-gradient(ellipse_at_top_right,rgba(186,230,253,0.75),transparent_60%)]",
    blob2       : "bg-[radial-gradient(ellipse_at_bottom_left,rgba(165,180,252,0.4),transparent_60%)]",
    text        : "text-[#0c4a6e]",
    subtext     : "text-[#0369a1]",
    card        : "bg-white/80 border border-[#bae6fd] backdrop-blur-sm",
    cardHover   : "hover:border-[#7dd3fc] hover:shadow-[0_4px_20px_rgba(56,189,248,0.14)]",
    input       : "bg-white/80 border border-[#bae6fd] text-[#0c4a6e] placeholder-[#93c5fd] focus:border-[#38bdf8] backdrop-blur-sm",
    statBase    : "bg-white/80 border border-[#bae6fd] backdrop-blur-sm",
    statAccent  : "bg-gradient-to-br from-[#38bdf8] to-[#6366f1]",
    statNum     : "text-[#0c4a6e]",
    statNumAcc  : "text-white",
    statLbl     : "text-[#0369a1]",
    statLblAcc  : "text-[rgba(255,255,255,0.75)]",
    progressBg  : "bg-[#e0f2fe]",
    progressBar : "from-[#38bdf8] to-[#6366f1]",
    pillActive  : "bg-[#0ea5e9] text-white border-[#0ea5e9]",
    pillInactive: "bg-white/80 text-[#0369a1] border-[#bae6fd] hover:border-[#7dd3fc]",
    taskTitle   : "text-[#0c4a6e]",
    taskDone    : "text-[#93c5fd]",
    taskDot     : "bg-gradient-to-br from-[#38bdf8] to-[#6366f1]",
    checkOff    : "border-[#93c5fd]",
    checkOn     : "bg-gradient-to-br from-[#38bdf8] to-[#6366f1]",
    editInput   : "border-b border-[#7dd3fc] text-[#0c4a6e]",
    actionBtn   : "bg-white/80 border border-[#bae6fd] hover:border-[#7dd3fc] backdrop-blur-sm",
    iconEdit    : "#38bdf8",
    iconDel     : "#f87171",
    saveBtn     : "bg-gradient-to-r from-[#38bdf8] to-[#6366f1] text-white",
    divider     : "border-[#bae6fd]",
    logoutText  : "text-[#93c5fd] hover:text-[#0369a1]",
    avatar      : "bg-gradient-to-br from-[#38bdf8] to-[#6366f1]",
    toggleBg    : "bg-white/80 border border-[#bae6fd] backdrop-blur-sm",
    toggleIcon  : "text-[#0369a1]",
    label       : "text-[#0369a1]",
    addBtn      : "bg-gradient-to-r from-[#38bdf8] to-[#6366f1] text-white shadow-[0_4px_14px_rgba(56,189,248,0.35)]",
    emptyText   : "text-[#93c5fd]",
    nameColor   : "text-[#0ea5e9]",
    shape1      : "border-[#bae6fd]",
    shape2      : "border-[#c7d2fe]",
  };

  /* ── API ── */
  const logout = () => { localStorage.removeItem("token"); navigate("/"); };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch  = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter  = filter === "all" ? true : filter === "completed" ? task.completed : !task.completed;
    return matchesSearch && matchesFilter;
  });

  const fetchTasks = async (token) => {
    try {
      if (!token) token = localStorage.getItem("token");
      const res = await axios.get("https://task-manager-api-8mn1.onrender.com/api/tasks", { headers: { Authorization: token } });
      setTasks(res.data);
    } catch (e) { console.log(e); }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("https://task-manager-api-8mn1.onrender.com/api/tasks", { title }, { headers: { Authorization: token } });
      setTasks([...tasks, res.data]);
      setTitle("");
    } catch (e) { console.log(e); }
    finally { setAdding(false); }
  };

  const toggleTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`https://task-manager-api-8mn1.onrender.com/api/tasks/${id}`, {}, { headers: { Authorization: token } });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (e) { console.log(e); }
  };

  const deleteTask = async (id) => {
    setDeletingId(id);
    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://task-manager-api-8mn1.onrender.com/api/tasks/${id}`, { headers: { Authorization: token } });
        setTasks(tasks.filter((t) => t._id !== id));
      } catch (e) { console.log(e); }
      finally { setDeletingId(null); }
    }, 280);
  };

  const editTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`https://task-manager-api-8mn1.onrender.com/api/tasks/edit/${id}`, { title: editTitle }, { headers: { Authorization: token } });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null); setEditTitle("");
    } catch (e) { console.log(e); }
  };

  const totalTasks     = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks   = totalTasks - completedTasks;
  const progressPct    = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div
      className={`min-h-screen ${t.page} flex justify-center p-5 transition-all duration-500 relative overflow-hidden`}
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* background blobs */}
      <div className={`pointer-events-none fixed inset-0 ${t.blob1} transition-all duration-700`} />
      <div className={`pointer-events-none fixed inset-0 ${t.blob2} transition-all duration-700`} />

      {/* floating decorative shapes */}
      <div
        className={`pointer-events-none fixed top-16 right-8 w-48 h-48 rounded-full border-2 ${t.shape1} opacity-40 transition-all duration-700`}
        style={{ animation: "floatA 8s ease-in-out infinite" }}
      />
      <div
        className={`pointer-events-none fixed bottom-24 left-6 w-32 h-32 border-2 ${t.shape2} opacity-30 transition-all duration-700`}
        style={{ borderRadius: "40% 60% 55% 45% / 50% 40% 60% 50%", animation: "floatB 10s ease-in-out infinite" }}
      />

      <style>{`
        @keyframes floatA  { 0%,100%{transform:translateY(0) rotate(0deg)}   50%{transform:translateY(-18px) rotate(6deg)} }
        @keyframes floatB  { 0%,100%{transform:translateY(0) rotate(0deg)}   50%{transform:translateY(14px) rotate(-8deg)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(16px)}       to{opacity:1;transform:translateY(0)} }
        @keyframes slideOut{ from{opacity:1;transform:translateX(0)}          to{opacity:0;transform:translateX(40px)} }
        @keyframes popIn   { from{opacity:0;transform:scale(0.94)}            to{opacity:1;transform:scale(1)} }
        .task-enter { animation: slideIn  .32s cubic-bezier(.34,1.4,.64,1) both; }
        .task-exit  { animation: slideOut .28s ease forwards; pointer-events:none; }
        .page-enter { animation: popIn    .4s  cubic-bezier(.34,1.2,.64,1) both; }
      `}</style>

      <div className={`relative z-10 w-full max-w-md ${mounted ? "page-enter" : "opacity-0"}`}>

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className={`text-[11px] font-medium uppercase tracking-[.1em] ${t.subtext} mb-1 transition-colors duration-500`}>
              {today}
            </p>
            <h1 className={`text-[22px] font-semibold leading-tight tracking-tight ${t.text} transition-colors duration-500`}>
              <span className={`${t.nameColor} transition-colors duration-500`}>Hey,</span> <span className={`${t.nameColor} transition-colors duration-500`}>{user?.name}</span> 👋
            </h1>
            <p className={`text-xs mt-0.5 ${t.subtext} transition-colors duration-500`}>
              {pendingTasks} task{pendingTasks !== 1 ? "s" : ""} remaining
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* theme toggle */}
            <button
              onClick={() => setDark(!dark)}
              className={`w-9 h-9 rounded-full flex items-center justify-center ${t.toggleBg} transition-all duration-300 hover:scale-110 active:scale-95`}
              title={dark ? "Switch to light" : "Switch to dark"}
            >
              {dark ? (
                /* sun */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={t.toggleIcon}>
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                /* moon */
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={t.toggleIcon}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* avatar */}
            <div className={`w-10 h-10 rounded-full ${t.avatar} flex items-center justify-center shadow-lg transition-all duration-500`}>
              <span className="text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Stat row ── */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { val: totalTasks,     lbl: "Total", accent: false },
            { val: completedTasks, lbl: "Done",  accent: true  },
            { val: pendingTasks,   lbl: "Left",  accent: false },
          ].map(({ val, lbl, accent }, i) => (
            <div
              key={lbl}
              className={`rounded-2xl p-3 text-center transition-all duration-500 ${accent ? t.statAccent : t.statBase}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`text-[26px] font-bold tracking-tight ${accent ? t.statNumAcc : t.statNum} transition-colors duration-500`}>
                {val}
              </div>
              <div className={`text-[9px] uppercase tracking-[.09em] mt-0.5 ${accent ? t.statLblAcc : t.statLbl} transition-colors duration-500`}>
                {lbl}
              </div>
            </div>
          ))}
        </div>

        {/* ── Progress bar ── */}
        <div className={`rounded-2xl px-4 py-4 mb-5 ${t.card} transition-all duration-500`}>
          <div className="flex justify-between items-baseline mb-3">
            <span className={`text-sm font-semibold ${t.text} transition-colors duration-500`}>Progress</span>
            <span className={`text-sm font-semibold ${t.subtext} transition-colors duration-500`}>{progressPct}%</span>
          </div>
          <div className={`${t.progressBg} rounded-full h-2 overflow-hidden transition-colors duration-500`}>
            <div
              className={`h-full bg-gradient-to-r ${t.progressBar} rounded-full transition-all duration-700`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className={`flex justify-between mt-2 text-[10px] ${t.subtext} transition-colors duration-500`}>
            <span>{completedTasks} done</span>
            <span>{pendingTasks} left</span>
          </div>
        </div>

        {/* ── Filter pills ── */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[11px] font-semibold uppercase tracking-[.1em] ${t.label} transition-colors duration-500`}>
            Tasks
          </span>
          <div className="flex gap-1.5">
            {["all", "completed", "pending"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[11px] px-3 py-1 rounded-full border font-medium transition-all duration-200 ${
                  filter === f ? t.pillActive : t.pillInactive
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Search ── */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none mb-3 transition-all duration-300 ${t.input}`}
        />

        {/* ── Add task ── */}
        <form onSubmit={addTask} className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-300 ${t.input}`}
          />
          <button
            type="submit"
            disabled={adding}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${t.addBtn} ${adding ? "opacity-60" : ""}`}
          >
            {adding ? "…" : "+ Add"}
          </button>
        </form>

        {/* ── Empty state ── */}
        {filteredTasks.length === 0 && (
          <p className={`text-sm text-center py-10 ${t.emptyText} transition-colors duration-500`}>
            No tasks here yet.
          </p>
        )}

        {/* ── Task list ── */}
        <div className="flex flex-col gap-2.5">
          {filteredTasks.map((task, i) => (
            <div
              key={task._id}
              className={`rounded-2xl px-4 py-3 flex items-center gap-3 transition-all duration-300 cursor-default
                ${t.card} ${t.cardHover}
                ${deletingId === task._id ? "task-exit" : "task-enter"}
                ${task.completed ? "opacity-50" : ""}
              `}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* checkbox toggle */}
              <button
                onClick={() => toggleTask(task._id)}
                className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-95
                  ${task.completed ? t.checkOn + " border-0" : t.checkOff}
                `}
              >
                {task.completed && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {/* accent dot */}
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.taskDot} transition-colors duration-500`} />

              {/* title / inline edit */}
              {editingId === task._id ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                  className={`flex-1 text-sm bg-transparent outline-none pb-0.5 transition-colors duration-500 ${t.editInput}`}
                />
              ) : (
                <span
                  className={`flex-1 text-sm font-medium transition-colors duration-300 ${
                    task.completed ? `line-through ${t.taskDone}` : t.taskTitle
                  }`}
                >
                  {task.title}
                </span>
              )}

              {/* action buttons */}
              <div className="flex gap-1.5 flex-shrink-0">
                {editingId === task._id ? (
                  <button
                    onClick={() => editTask(task._id)}
                    className={`text-[11px] px-3 py-1 rounded-lg font-bold transition-all duration-200 active:scale-95 ${t.saveBtn}`}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => { setEditingId(task._id); setEditTitle(task.title); }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${t.actionBtn}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.iconEdit} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => deleteTask(task._id)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${t.actionBtn}`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.iconDel} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Logout ── */}
        <div className={`mt-6 pt-4 border-t ${t.divider} flex justify-end transition-colors duration-500`}>
          <button
            onClick={logout}
            className={`text-xs flex items-center gap-1.5 transition-colors duration-200 ${t.logoutText}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log out
          </button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;