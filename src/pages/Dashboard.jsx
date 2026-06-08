import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  useEffect(() => {
    fetchTasks();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "completed"
        ? task.completed
        : !task.completed;

    return matchesSearch && matchesFilter;
  });

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: token },
      });
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        { title },
        { headers: { Authorization: token } }
      );
      setTasks([...tasks, response.data]);
      setTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {},
        { headers: { Authorization: token } }
      );
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: token },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const editTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/tasks/edit/${id}`,
        { title: editTitle },
        { headers: { Authorization: token } }
      );
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
      setEditingId(null);
      setEditTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPct = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex justify-center p-6">
      <div className="w-full">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-medium text-[#111] tracking-tight leading-tight">
              Good morning, {user?.name}
            </h1>
            <p className="text-xs text-[#aaa] mt-1">
              {today} · {pendingTasks} tasks left
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#111] flex items-center justify-center flex-shrink-0">
            <span className="text-[#f7f6f3] text-sm font-medium">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>
        </div>

        {/* ── Stat row ── */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-white border border-[#ebebeb] rounded-xl p-3 text-center">
            <div className="text-[22px] font-medium text-[#111] tracking-tight">
              {totalTasks}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#bbb] mt-0.5">
              Total
            </div>
          </div>
          <div className="bg-[#111] border border-[#111] rounded-xl p-3 text-center">
            <div className="text-[22px] font-medium text-[#f7f6f3] tracking-tight">
              {completedTasks}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#666] mt-0.5">
              Done
            </div>
          </div>
          <div className="bg-white border border-[#ebebeb] rounded-xl p-3 text-center">
            <div className="text-[22px] font-medium text-[#111] tracking-tight">
              {pendingTasks}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#bbb] mt-0.5">
              Left
            </div>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="bg-white border border-[#ebebeb] rounded-2xl px-4 py-4 mb-5">
          <div className="flex justify-between items-baseline mb-2.5">
            <span className="text-sm font-medium text-[#111]">
              Today's progress
            </span>
            <span className="text-sm text-[#aaa]">{progressPct}% complete</span>
          </div>
          <div className="bg-[#ebebeb] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-[#111] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* ── Section header + filters ── */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium text-[#aaa] uppercase tracking-widest">
            Tasks
          </span>
          <div className="flex gap-1.5">
            {["all", "completed", "pending"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                  filter === f
                    ? "bg-[#111] text-[#f7f6f3] border-[#111]"
                    : "bg-white text-[#888] border-[#e0e0e0] hover:border-[#bbb]"
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
          className="w-full bg-white border border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm text-[#111] placeholder-[#ccc] outline-none mb-3 focus:border-[#bbb] transition-colors"
        />

        {/* ── Add task ── */}
        <form onSubmit={addTask} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-white border border-[#e0e0e0] rounded-xl px-4 py-2.5 text-sm text-[#111] placeholder-[#ccc] outline-none focus:border-[#bbb] transition-colors"
          />
          <button
            type="submit"
            className="bg-[#111] text-[#f7f6f3] text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#333] transition-colors"
          >
            + Add
          </button>
        </form>

        {/* ── Empty state ── */}
        {filteredTasks.length === 0 && (
          <p className="text-sm text-[#ccc] text-center py-6">
            No tasks found.
          </p>
        )}

        {/* ── Task list ── */}
        <div className="flex flex-col gap-2">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white border border-[#ebebeb] rounded-xl px-4 py-3 flex items-center gap-3 transition-opacity ${
                task.completed ? "opacity-50" : ""
              }`}
            >
              {/* Checkbox / toggle */}
              <button
                onClick={() => toggleTask(task._id)}
                className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors ${
                  task.completed
                    ? "bg-[#111] border-[#111]"
                    : "border-[#d0d0d0] hover:border-[#aaa]"
                }`}
              >
                {task.completed && (
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                  >
                    <path
                      d="M1 4l3 3 5-6"
                      stroke="#f7f6f3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              {/* Title / edit input */}
              {editingId === task._id ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 text-sm text-[#111] border-b border-[#bbb] bg-transparent outline-none pb-0.5"
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-1 text-sm ${
                    task.completed
                      ? "line-through text-[#bbb]"
                      : "text-[#111]"
                  }`}
                >
                  {task.title}
                </span>
              )}

              {/* Action buttons */}
              <div className="flex gap-1.5">
                {editingId === task._id ? (
                  <button
                    onClick={() => editTask(task._id)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#111] text-[#f7f6f3] font-medium hover:bg-[#333] transition-colors"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(task._id);
                      setEditTitle(task.title);
                    }}
                    className="w-7 h-7 rounded-lg border border-[#e8e8e8] bg-[#faf9f7] flex items-center justify-center hover:border-[#bbb] transition-colors"
                    title="Edit"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#aaa"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                )}

                <button
                  onClick={() => deleteTask(task._id)}
                  className="w-7 h-7 rounded-lg border border-[#e8e8e8] bg-[#faf9f7] flex items-center justify-center hover:border-red-200 transition-colors"
                  title="Delete"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#e57373"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Logout ── */}
        <div className="mt-6 pt-4 border-t border-[#e8e8e8] flex justify-end">
          <button
            onClick={logout}
            className="text-xs text-[#bbb] hover:text-[#888] transition-colors flex items-center gap-1.5"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;