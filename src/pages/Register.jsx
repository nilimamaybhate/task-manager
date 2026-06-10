import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { registerUser } from "../api/authApi";

function Register() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim())     { setError("Name is required.");     return; }
    if (!email.trim())    { setError("Email is required.");    return; }
    if (!password.trim()) { setError("Password is required."); return; }

    setLoading(true);
    try {
      const data = await registerUser(name, email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f0f9ff] flex items-center justify-center p-5 relative overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* background blobs */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(186,230,253,0.75),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(165,180,252,0.4),transparent_60%)]" />

      {/* floating shapes */}
      <div
        className="pointer-events-none fixed top-16 right-8 w-48 h-48 rounded-full border-2 border-[#bae6fd] opacity-40"
        style={{ animation: "floatA 8s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none fixed bottom-24 left-6 w-32 h-32 border-2 border-[#c7d2fe] opacity-30"
        style={{ borderRadius: "40% 60% 55% 45% / 50% 40% 60% 50%", animation: "floatB 10s ease-in-out infinite" }}
      />

      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)}  50%{transform:translateY(-18px) rotate(6deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)}  50%{transform:translateY(14px) rotate(-8deg)} }
        @keyframes popIn  { from{opacity:0;transform:scale(0.94) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .card-enter { animation: popIn .4s cubic-bezier(.34,1.2,.64,1) both; }
      `}</style>

      {/* card */}
      <div className="relative z-10 w-full max-w-sm card-enter">
        <div className="bg-white/80 backdrop-blur-sm border border-[#bae6fd] rounded-3xl p-8 shadow-[0_8px_40px_rgba(56,189,248,0.12)]">

          {/* icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#6366f1] flex items-center justify-center shadow-[0_4px_14px_rgba(56,189,248,0.4)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
          </div>

          <h1 className="text-[22px] font-bold text-[#0c4a6e] text-center tracking-tight mb-1">
            Create account
          </h1>
          <p className="text-xs text-[#0369a1] text-center mb-6">
            Sign up to get started
          </p>

          {/* error — red */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-sm text-red-600 font-medium leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {/* name */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[.08em] text-[#0369a1] block mb-1.5">
                Name
              </label>
              <Input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                className="w-full bg-white/80 border border-[#bae6fd] rounded-xl px-4 py-2.5 text-sm text-[#0c4a6e] placeholder-[#93c5fd] outline-none focus:border-[#38bdf8] transition-colors"
              />
            </div>

            {/* email */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[.08em] text-[#0369a1] block mb-1.5">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full bg-white/80 border border-[#bae6fd] rounded-xl px-4 py-2.5 text-sm text-[#0c4a6e] placeholder-[#93c5fd] outline-none focus:border-[#38bdf8] transition-colors"
              />
            </div>

            {/* password */}
            <div className="mb-2">
              <label className="text-[11px] font-semibold uppercase tracking-[.08em] text-[#0369a1] block mb-1.5">
                Password
              </label>
              <Input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full bg-white/80 border border-[#bae6fd] rounded-xl px-4 py-2.5 text-sm text-[#0c4a6e] placeholder-[#93c5fd] outline-none focus:border-[#38bdf8] transition-colors"
              />
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#38bdf8] to-[#6366f1] shadow-[0_4px_14px_rgba(56,189,248,0.35)] transition-all duration-200 hover:opacity-90 active:scale-95 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          {/* login link */}
          <p className="mt-5 text-center text-xs text-[#0369a1]">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-bold text-[#0ea5e9] hover:text-[#6366f1] transition-colors"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;