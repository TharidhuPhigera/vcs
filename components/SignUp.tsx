"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col space-y-2 w-full ${className}`}>
      {children}
    </div>
  );
};

export function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // Default to employee role
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // New loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    if (!username || !password || !role) {
      setError("All fields are required.");
      return;
    }

    // Password length validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true); // Start loading

    try {
      // Check if the user already exists by username
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!resUserExists.ok) {
        const errorDetails = await resUserExists.text();
        console.error("Error checking if user exists:", errorDetails);
        throw new Error("Failed to check if user exists.");
      }

      const data = await resUserExists.json();

      if (data.userExists) {
        setError("Username already exists.");
        setLoading(false); // Stop loading
        return;
      }

      // Proceed with registration if user does not exist
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const result = await res.json();
        setError(result.message || "User registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Error during registration.");
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LabelInputContainer>
        <label htmlFor="username" className="text-white">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          type="text"
          className="bg-black text-white p-2 rounded"
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <label htmlFor="password" className="text-white">Password</label>
        <input
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          type="password"
          className="bg-black text-white p-2 rounded"
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <label htmlFor="role" className="text-white">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-black text-white p-2 rounded"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
      </LabelInputContainer>

      <button
        type="submit"
        className="w-full bg-black text-white rounded-md py-2 hover:bg-gray-800 transition"
        disabled={loading} // Disable while loading
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </button>

      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}

      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      <div className="flex flex-col space-y-4">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full bg-black text-white rounded-md py-2 hover:bg-gray-800 transition"
        >
          Log In
        </button>
      </div>
    </form>
  );
}