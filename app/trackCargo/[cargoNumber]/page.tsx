"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface Cargo {
  referenceNumber: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  unitCount: number;
  payment: string;
  note: string;
  imageUrl: string;
  password: string;
}

const CARGO_API_URL = "/api/cargoClient";

export default function TrackCargoPage({ params }: { params: Promise<{ cargoNumber: string }> }) {
  const [cargoData, setCargoData] = useState<Cargo | null>(null);
  const [cargoNumber, setCargoNumber] = useState<string | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    params.then((resolvedParams) => {
      setCargoNumber(resolvedParams.cargoNumber);
    });
  }, [params]);

  useEffect(() => {
    if (cargoNumber) {
      fetchCargoData(cargoNumber);
    }
  }, [cargoNumber]);

  const fetchCargoData = async (referenceNumber: string) => {
    try {
      const response = await fetch(`${CARGO_API_URL}?referenceNumber=${referenceNumber}`);
      if (!response.ok) throw new Error("Failed to fetch cargo data");
      const data: Cargo = await response.json();
      setCargoData(data);
    } catch (error) {
      console.error("Error fetching cargo data:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleMediaModal = () => {
    setIsMediaModalOpen(!isMediaModalOpen);
    if (isMediaModalOpen) {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const isVideoFile = () => {
    if (!cargoData?.imageUrl) return false;
    const extension = cargoData.imageUrl.split('.').pop()?.toLowerCase();
    return ['mp4', 'mov', 'avi', 'webm'].includes(extension || '');
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
          onClick={() => router.push("/")}
          className="text-white bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-black/30 transition border border-white/10"
        >
          Home
        </button>
      </div>

      {/* Main Content */}
      <div className="text-center mb-8 z-10">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Track Cargo
        </h1>
        <p className="text-lg text-white/80 mt-2">Your Cargo Details</p>
      </div>

      {/* Cargo Details Card */}
      {cargoData ? (
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-white/10 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 font-medium">Reference Number</label>
                <p className="text-white font-semibold">{cargoData.referenceNumber}</p>
              </div>
              <div>
                <label className="block text-white/80 font-medium">Status</label>
                <p className="text-white font-semibold">{cargoData.status}</p>
              </div>
              <div>
                <label className="block text-white/80 font-medium">Origin</label>
                <p className="text-white font-semibold">{cargoData.origin}</p>
              </div>
              <div>
                <label className="block text-white/80 font-medium">Destination</label>
                <p className="text-white font-semibold">{cargoData.destination}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 font-medium">Estimated Delivery</label>
                <p className="text-white font-semibold">{formatDate(cargoData.estimatedDelivery)}</p>
              </div>
              <div>
                <label className="block text-white/80 font-medium">Unit Count</label>
                <p className="text-white font-semibold">{cargoData.unitCount}</p>
              </div>
              <div>
                <label className="block text-white/80 font-medium">Payment</label>
                <p className="text-white font-semibold">€{cargoData.payment}</p>
              </div>
              <div>
                <label className="block text-white/80 font-medium">Note</label>
                <p className="text-white font-semibold">{cargoData.note}</p>
              </div>
            </div>
          </div>

          {/* Media Section */}
          {cargoData.imageUrl && (
            <div className="mt-6 text-center">
              <label className="block text-white/80 font-medium mb-2">
                {isVideoFile() ? "Cargo Video" : "Cargo Image"}
              </label>
              <div 
                className="relative w-64 h-64 mx-auto cursor-pointer"
                onClick={toggleMediaModal}
              >
                {isVideoFile() ? (
                  <>
                    <video
                      src={cargoData.imageUrl}
                      className="w-full h-full object-cover rounded-lg border border-white/10"
                      muted
                      loop
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                      <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={cargoData.imageUrl}
                    alt="Cargo Media"
                    className="w-full h-full object-cover rounded-lg border border-white/10"
                  />
                )}
              </div>
              <p className="text-sm text-white/60 mt-2">
                Click to {isVideoFile() ? "play video" : "view image"}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-white z-10">Loading cargo details...</p>
      )}

      {/* Media Modal */}
      {isMediaModalOpen && cargoData?.imageUrl && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={toggleMediaModal}
        >
          <div 
            className="relative w-full max-w-4xl bg-gray-900 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 bg-gray-800">
              <h2 className="text-lg font-medium text-white">
                {cargoData.referenceNumber} - {isVideoFile() ? "Video" : "Image"}
              </h2>
              <button
                onClick={toggleMediaModal}
                className="text-white hover:text-gray-300 text-xl p-1 transition-colors"
              >
                ✖
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-2 bg-black">
              {isVideoFile() ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={cargoData.imageUrl}
                    className="w-full max-h-[80vh]"
                    controls
                    autoPlay
                    onClick={togglePlayPause}
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <button
                      onClick={togglePlayPause}
                      className="bg-white/20 backdrop-blur-md rounded-full p-3 text-white hover:bg-white/30 transition"
                    >
                      {isPlaying ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a1 1 0 00-1 1v10a1 1 0 002 0V5a1 1 0 00-1-1zm8 0a1 1 0 00-1 1v10a1 1 0 002 0V5a1 1 0 00-1-1z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <img
                  src={cargoData.imageUrl}
                  alt="Cargo Media"
                  className="w-full max-h-[80vh] object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}