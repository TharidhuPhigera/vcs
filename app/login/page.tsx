"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.message || 'Login failed');
      return;
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    router.push(`/${data.role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a33] to-[#004d66] flex flex-col items-center justify-center relative text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-64 h-64 bg-[#00b5e2] rounded-full opacity-20 animate-blob animation-delay-2000 top-1/4 left-1/4"></div>
        <div className="absolute w-64 h-64 bg-[#009ec1] rounded-full opacity-20 animate-blob animation-delay-4000 top-1/2 right-1/4"></div>
        <div className="absolute w-64 h-64 bg-[#007399] rounded-full opacity-20 animate-blob animation-delay-6000 bottom-1/4 left-1/2"></div>
      </div>

      {/* Track Button */}
      <div className="absolute top-0 w-full flex justify-end p-4 z-10">
        <button
          onClick={() => router.push("/")}
          className="text-white bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-black/30 transition border border-white/10"
        >
          Track
        </button>
      </div>

      {/* Main Content */}
      <div className="text-center mb-8 z-10">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Vipula Cargo Service
        </h1>
        <p className="text-lg text-white/80 mt-2">Delivering Excellence Worldwide</p>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleFormSubmit}
        className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-md border border-white/10 z-10"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Login
        </h2>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-white/80 font-medium mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-[#00b5e2] focus:outline-none text-white placeholder-white/50 border border-white/10"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-white/80 font-medium mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-[#00b5e2] focus:outline-none text-white placeholder-white/50 border border-white/10"
            placeholder="Enter your password"
          />
        </div>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#00b5e2] text-white py-2 rounded-lg hover:bg-[#009ec1] transition backdrop-blur-md"
        >
          Login
        </button>
      </form>
    </div>
  );
}