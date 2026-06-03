import { Link } from "react-router-dom";
import { useState } from "react";
import Input from "../components/Input";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    
    setError("");

    if(!name.trim()){
        setError("name is required");
        return;
    }

    if(!email.trim()){
        setError("email is required");
        return;
    }

    if(!password.trim()){
        setError("password is required");
        return;
    }
    
    console.log({name,email,password});

};
        
     return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Register
        </h1>

        {error && (
          <p className="mb-4 rounded bg-red-100 p-3 text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full rounded bg-black p-3 text-white"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-semibold text-blue-600"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;