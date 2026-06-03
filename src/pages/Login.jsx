import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  const handleSubmit = (e) => {
  e.preventDefault();

  setError("");

  if(!email.trim()) {
    setError("Email is required");
    return;
  }

  if(!password.trim()) {
    setError("password is required");
    return;
  }

  if (!emailRegex.test(email)) {
  setError("Please enter a valid email");
  return;
}

  console.log("Email:", email);
  console.log("Password:", password);
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Login
        </h1>
        
        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">

            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
          

            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
             
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-black p-3 text-white"
          >
            Login
          </button>

          <p className="mt-4 text-center">
  Don't have an account?{" "}
  <Link
    to="/Register"
    className="font-semibold text-blue-600"
  >
    Register
  </Link>
</p>
        </form>
        <p>
            email:{email}
            <br />
            password:{password}
        </p>
      </div>
    </div>
  );
}

export default Login;