"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Cargo {
  _id: string;
  referenceNumber: string;
  note: string;
  imageUrl: string; // This will store either image or video URL
  estimatedDelivery: string;
  status: string;
}

export default function EmployeePage() {
  const [cargoNumber, setCargoNumber] = useState("");
  const [note, setNote] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [status, setStatus] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [existingCargo, setExistingCargo] = useState<Cargo | null>(null);
  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCargoData = async () => {
      try {
        const response = await fetch("/api/cargo");
        const data = await response.json();
        setCargoList(data);
      } catch (error) {
        console.error("Error fetching cargo data:", error);
      }
    };
    fetchCargoData();
  }, []);

  const handleCargoNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCargoNumber(e.target.value);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };

  const handleEstimatedDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEstimatedDelivery(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setMediaFile(file);
  };

  const handleSearchCargo = () => {
    const foundCargo = cargoList.find((cargo) => cargo.referenceNumber === cargoNumber);
    if (foundCargo) {
      setExistingCargo(foundCargo);
      setNote(foundCargo.note);
      setEstimatedDelivery(foundCargo.estimatedDelivery || "");
      setStatus(foundCargo.status || "");
    } else {
      alert("Cargo number not found.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cargoNumber || !note || !estimatedDelivery || !status) {
      alert("Please fill out all the required fields.");
      return;
    }

    try {
      let mediaUrl = existingCargo?.imageUrl || "";

      // Upload media to Cloudinary if a new one is selected
      if (mediaFile) {
        const formData = new FormData();
        formData.append("file", mediaFile);
        formData.append("upload_preset", "VipulaCargoService");

        // Determine if the file is a video
        const isVideo = mediaFile.type.startsWith('video/');
        const cloudinaryEndpoint = isVideo 
          ? "https://api.cloudinary.com/v1_1/de4cqxrsu/video/upload"
          : "https://api.cloudinary.com/v1_1/de4cqxrsu/image/upload";

        const uploadResponse = await fetch(cloudinaryEndpoint, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Media upload failed");
        }

        const uploadData = await uploadResponse.json();
        mediaUrl = uploadData.secure_url;
      }

      // Prepare the updated cargo data
      const updatedCargo = {
        note,
        estimatedDelivery,
        status,
        imageUrl: mediaUrl, // This will store either image or video URL
      };

      const response = await fetch(`/api/cargo/${existingCargo?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCargo),
      });

      if (response.ok) {
        alert("Cargo info updated successfully!");
        setCargoNumber("");
        setNote("");
        setEstimatedDelivery("");
        setStatus("");
        setMediaFile(null);
        setExistingCargo(null);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error updating cargo info.");
      }
    } catch (error) {
      console.error("Error submitting cargo info:", error);
      alert("Error submitting cargo info.");
    }
  };

  const isVideoFile = (url: string) => {
    if (!url) return false;
    const extension = url.split('.').pop()?.toLowerCase();
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
          Log Out
        </button>
      </div>

      {/* Logo/Company Name */}
      <div className="text-center mb-8 z-10">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Vipula Cargo Service
        </h1>
        <p className="text-lg text-white/80 mt-2">
          Update Cargo Information
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleFormSubmit}
        className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-white/10 z-10"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Update Cargo Details
        </h2>

        {/* Cargo Number */}
        <div className="mb-4">
          <label className="block text-white/80 font-medium mb-2">
            Cargo Number
          </label>
          <input
            type="text"
            value={cargoNumber}
            onChange={handleCargoNumberChange}
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-[#00b5e2] focus:outline-none text-white placeholder-white/50 border border-white/10"
            placeholder="Enter cargo number"
          />
        </div>

        <button
          type="button"
          onClick={handleSearchCargo}
          className="w-full bg-[#00b5e2] text-white py-2 rounded-lg hover:bg-[#009ec1] transition mb-4"
        >
          Search Cargo
        </button>

        {/* Grid Layout for Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estimated Delivery */}
          <div className="mb-4">
            <label className="block text-white/80 font-medium mb-2">
              Estimated Delivery
            </label>
            <input
              type="date"
              value={estimatedDelivery}
              onChange={handleEstimatedDeliveryChange}
              className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-[#00b5e2] focus:outline-none text-white placeholder-white/50 border border-white/10"
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-white/80 font-medium mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-[#00b5e2] focus:outline-none text-white placeholder-white/50 border border-white/10"
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="block text-white/80 font-medium mb-2">
            Note
          </label>
          <textarea
            value={note}
            onChange={handleNoteChange}
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-[#00b5e2] focus:outline-none text-white placeholder-white/50 border border-white/10"
            placeholder="Add a note"
            rows={4}
          />
        </div>

        {/* Media Upload */}
        <div className="mb-6">
          <label className="block text-white/80 font-medium mb-2">
            Upload Proof (Image or Video)
          </label>
          <input
            type="file"
            onChange={handleMediaChange}
            accept="image/*, video/*"
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-[#00b5e2] focus:outline-none text-white placeholder-white/50 border border-white/10"
          />
          <p className="text-sm text-white/60 mt-1">
            Accepted formats: JPG, PNG, GIF, MP4, MOV, AVI
          </p>
        </div>

        {/* Display Existing Media */}
        {existingCargo?.imageUrl && (
          <div className="mb-6">
            <label className="block text-white/80 font-medium mb-2">
              Existing Proof
            </label>
            {isVideoFile(existingCargo.imageUrl) ? (
              <div className="relative">
                <video
                  src={existingCargo.imageUrl}
                  className="w-full h-auto rounded-lg"
                  controls
                />
              </div>
            ) : (
                <Image
                  src={existingCargo.imageUrl}
                  alt="Cargo Proof"
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#00b5e2] text-white py-2 rounded-lg hover:bg-[#009ec1] transition"
        >
          Update Cargo
        </button>
      </form>
    </div>
  );
}