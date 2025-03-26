"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = (cargoNumber: string, password: string) => {
    // Basic password validation
    if (password.length < 3) {
      return "Password must be at least 3 characters";
    }

    if (password.length > 50) {
      return "Password must be less than 50 characters";
    }

    return null;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const cargoNumber = (e.target as HTMLFormElement).cargoNumber.value.trim();
    const password = (e.target as HTMLFormElement).password.value.trim();

    // Client-side validation
    const validationError = validateInputs(cargoNumber, password);
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ referenceNumber: cargoNumber, password }),
      });

      if (response.ok) {
        const cargo = await response.json();
        router.push(`/trackCargo/${cargo.referenceNumber}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid cargo number or password. Please try again.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a33] to-[#004d66] flex flex-col items-center justify-center relative text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-64 h-64 bg-[#00b5e2] rounded-full opacity-20 animate-blob animation-delay-2000 top-1/4 left-1/4"></div>
        <div className="absolute w-64 h-64 bg-[#009ec1] rounded-full opacity-20 animate-blob animation-delay-4000 top-1/2 right-1/4"></div>
        <div className="absolute w-64 h-64 bg-[#007399] rounded-full opacity-20 animate-blob animation-delay-6000 bottom-1/4 left-1/2"></div>
      </div>

      {/* Navbar */}
      <div className="absolute top-0 w-full flex justify-end p-4 z-10">
        <button
          onClick={() => router.push("/login")}
          className="text-white bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-black/30 transition border border-white/10"
        >
          Admin
        </button>
      </div>

      {/* Logo/Company Name */}
      <div className="text-center mb-8 z-10">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Vipula Cargo Service
        </h1>
        <p className="text-lg text-white/80 mt-2">
          Delivering Excellence Worldwide
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleFormSubmit}
        className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-md border border-white/10 z-10"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Track Your Cargo
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-100 rounded-lg border border-red-500/30">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="cargoNumber"
            className="block text-white/80 font-medium mb-2"
          >
            Cargo Number
          </label>
          <input
            type="text"
            id="cargoNumber"
            name="cargoNumber"
            required
            maxLength={16}
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-[#00b5e2] focus:outline-none text-white placeholder-white/50 border border-white/10"
            placeholder="Enter 8-16 character cargo number"
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
            required
            minLength={3}
            maxLength={50}
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-[#00b5e2] focus:outline-none text-white placeholder-white/50 border border-white/10"
            placeholder="Enter password (6-50 characters)"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${isLoading ? 'bg-[#007399]' : 'bg-[#00b5e2] hover:bg-[#009ec1]'} text-white py-2 rounded-lg transition backdrop-blur-md flex justify-center items-center`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Track Now"
          )}
        </button>
      </form>
    </div>
  );
}