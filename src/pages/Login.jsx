import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { loginUser } from "../api/authApi";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

       console.log("DATA:", data);                          // 👈 add this
    console.log("TOKEN:", data.token);  

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center p-5 relative overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* background blobs — matches dashboard Sky Frost */}
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
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(6deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(14px) rotate(-8deg)} }
        @keyframes popIn  { from{opacity:0;transform:scale(0.94) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes shake  { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        .card-enter  { animation: popIn .4s cubic-bezier(.34,1.2,.64,1) both; }
        .shake       { animation: shake .4s ease; }
      `}</style>

      {/* card */}
      <div className="relative z-10 w-full max-w-sm card-enter">
        <div className="bg-white/80 backdrop-blur-sm border border-[#bae6fd] rounded-3xl p-8 shadow-[0_8px_40px_rgba(56,189,248,0.12)]">

          {/* avatar icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#6366f1] flex items-center justify-center shadow-[0_4px_14px_rgba(56,189,248,0.4)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>

          <h1 className="text-[22px] font-bold text-[#0c4a6e] text-center tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-xs text-[#0369a1] text-center mb-6">
            Sign in to your account
          </p>

          {/* error message — red, styled */}
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
                placeholder="Enter your password"
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
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* register link */}
          <p className="mt-5 text-center text-xs text-[#0369a1]">
            Don't have an account?{" "}
            <Link
              to="/Register"
              className="font-bold text-[#0ea5e9] hover:text-[#6366f1] transition-colors"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;