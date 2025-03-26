"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { AiOutlineEye, AiOutlineEdit, AiOutlineSearch, AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import { CargoForm } from "@/components/CargoForm";
import { ViewCargoModal } from "@/components/ViewCargo";
import { Cargo } from "@/app/types";

const CARGO_API_URL = "/api/cargo";

export default function AdminDemoPage() {
  const [cargoData, setCargoData] = useState<Cargo[]>([]);
  const [filteredCargo, setFilteredCargo] = useState<Cargo[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCargo, setCurrentCargo] = useState<Cargo | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [newCargo, setNewCargo] = useState<Cargo>({
    referenceNumber: "",
    status: "",
    origin: "",
    destination: "",
    estimatedDelivery: "",
    unitCount: 1,
    payment: "",
    note: "",
    imageUrl: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  // Initialize with all cargo data
  useEffect(() => {
    fetchCargoData();
  }, []);

useEffect(() => {
  let result = [...cargoData];
  
  // Apply search filter
  if (searchTerm) {
    result = result.filter(cargo => 
      cargo.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply sorting
  result.sort((a, b) => {
    const numA = parseInt(a.referenceNumber.replace(/\D/g, ''));
    const numB = parseInt(b.referenceNumber.replace(/\D/g, ''));
    return sortOrder === "asc" ? numA - numB : numB - numA;
  });
  
  setFilteredCargo(result);
}, [cargoData, searchTerm, sortOrder]);

  const fetchCargoData = async () => {
    try {
      const response = await fetch(CARGO_API_URL);
      if (!response.ok) throw new Error("Failed to fetch cargo data");
      const data: Cargo[] = await response.json();
      setCargoData(data);
    } catch (error) {
      console.error("Error fetching cargo data:", error);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleSortOrder = () => setSortOrder(prev => prev === "asc" ? "desc" : "asc");

  useEffect(() => {
    fetchCargoData();
  }, []);

  const handleView = (cargoNumber: string) => {
    const selectedCargo = cargoData.find(c => c.referenceNumber === cargoNumber);
    if (selectedCargo) {
      setCurrentCargo(selectedCargo);
      setShowViewModal(true);
    }
  };

  const handleEdit = (cargoNumber: string) => {
    const selectedCargo = cargoData.find(c => c.referenceNumber === cargoNumber);
    if (selectedCargo) {
      setCurrentCargo(selectedCargo);
      setShowEditModal(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleAddCargo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = newCargo.imageUrl;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "VipulaCargoService");

        const isVideo = imageFile.type.startsWith('video/');
        const endpoint = isVideo 
          ? "https://api.cloudinary.com/v1_1/de4cqxrsu/video/upload"
          : "https://api.cloudinary.com/v1_1/de4cqxrsu/image/upload";

        const uploadResponse = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error("File upload failed");
        const data = await uploadResponse.json();
        imageUrl = data.secure_url;
      }

      // Upload additional files
      const uploadedFiles: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "VipulaCargoService");

        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/de4cqxrsu/image/upload",
          { method: "POST", body: formData }
        );

        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          uploadedFiles.push(data.secure_url);
        } else {
          throw new Error("File upload failed");
        }
      }

      const response = await fetch(CARGO_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCargo, imageUrl, files: uploadedFiles }),
      });

      if (response.ok) {
        const addedCargo = await response.json();
        setCargoData([...cargoData, addedCargo]);
        setShowAddForm(false);
        setFiles([]);
        resetForm();
      } else {
        throw new Error("Error adding cargo");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleUpdateCargo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCargo) return;
  
    try {
      let imageUrl = currentCargo.imageUrl;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "VipulaCargoService");
  
        const isVideo = imageFile.type.startsWith('video/');
        const endpoint = isVideo 
          ? "https://api.cloudinary.com/v1_1/de4cqxrsu/video/upload"
          : "https://api.cloudinary.com/v1_1/de4cqxrsu/image/upload";
  
        const uploadResponse = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
  
        if (!uploadResponse.ok) throw new Error("File upload failed");
        const data = await uploadResponse.json();
        imageUrl = data.secure_url;
      }
  
      const updatedCargo = {
        note: currentCargo.note,
        imageUrl,
        estimatedDelivery: currentCargo.estimatedDelivery,
        status: currentCargo.status,
        origin: currentCargo.origin,
        destination: currentCargo.destination,
        unitCount: currentCargo.unitCount,
        payment: currentCargo.payment
      };
  
      const response = await fetch(`${CARGO_API_URL}/${currentCargo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCargo),
      });
  
      if (response.ok) {
        const updatedData = await response.json();
        setCargoData(cargoData.map(c => 
          c._id === updatedData._id ? updatedData : c
        ));
        setShowEditModal(false);
        setImageFile(null);
        alert("Cargo updated successfully!");
      } else {
        throw new Error("Error updating cargo");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const resetForm = () => {
    setNewCargo({
      referenceNumber: "",
      status: "",
      origin: "",
      destination: "",
      estimatedDelivery: "",
      unitCount: 1,
      payment: "",
      note: "",
      imageUrl: "",
      password: "",
    });
    setImageFile(null);
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a33] to-[#004d66] flex flex-col items-center justify-start relative text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-64 h-64 bg-[#00b5e2] rounded-full opacity-20 animate-blob animation-delay-2000 top-1/4 left-1/4"></div>
        <div className="absolute w-64 h-64 bg-[#009ec1] rounded-full opacity-20 animate-blob animation-delay-4000 top-1/2 right-1/4"></div>
        <div className="absolute w-64 h-64 bg-[#007399] rounded-full opacity-20 animate-blob animation-delay-6000 bottom-1/4 left-1/2"></div>
      </div>

      {/* Top-right Logout Button */}
      <div className="absolute top-0 w-full flex justify-end p-4 z-10">
        <button
          onClick={handleSignOut}
          className="text-white bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-black/30 transition border border-white/10"
        >
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 w-full max-w-7xl z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Vipula Cargo Service
          </h1>
          <p className="text-lg text-white/80 mt-2">View and Edit Cargo Details</p>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AiOutlineSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by reference number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-[#00b5e2] focus:outline-none text-white placeholder-white/50 border border-white/10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="text-gray-400 hover:text-white">×</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4 w-full md:w-auto">
            <button
              onClick={toggleSortOrder}
              className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-white/20 transition border border-white/10"
            >
              {sortOrder === "asc" ? (
                <AiOutlineSortAscending className="mr-2" />
              ) : (
                <AiOutlineSortDescending className="mr-2" />
              )}
              Sort {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#00b5e2] text-white px-4 py-2 rounded-lg hover:bg-[#009ec1] transition transform hover:scale-105 backdrop-blur-md whitespace-nowrap"
            >
              + Add Cargo
            </button>
          </div>
        </div>

        {/* Cargo Data Table */}
        <div className="w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/10">
          <table className="w-full">
            <thead className="bg-[#155E95]/50 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-white">
                  Cargo Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-white">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-white">
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredCargo.length > 0 ? (
                filteredCargo.map((cargo) => (
                  <tr
                    key={cargo.referenceNumber}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-md text-white font-bold">
                      {cargo.referenceNumber}
                    </td>
                    <td className="px-6 py-4 text-md text-white">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cargo.status === "Delivered" ? "bg-green-500/20 text-green-400" :
                        cargo.status === "In Transit" ? "bg-blue-500/20 text-blue-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {cargo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleView(cargo.referenceNumber)}
                          className="bg-[#00b5e2] text-white px-4 py-2 rounded-md hover:bg-[#009ec1] transition transform hover:scale-105 backdrop-blur-md"
                          title="View"
                        >
                          <AiOutlineEye size={20} />
                        </button>
                        <button
                          onClick={() => handleEdit(cargo.referenceNumber)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition transform hover:scale-105 backdrop-blur-md"
                          title="Edit"
                        >
                          <AiOutlineEdit size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-white/70">
                    {searchTerm ? "No matching cargo found" : "No cargo data available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals (keep all your existing modal code unchanged) */}
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="New Cargo">
        <CargoForm
          newCargo={newCargo}
          setNewCargo={setNewCargo}
          handleAddCargo={handleAddCargo}
          handleFileChange={handleFileChange}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
        />
      </Modal>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="View Cargo Details">
        <ViewCargoModal viewCargo={currentCargo} onClose={() => setShowViewModal(false)} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Cargo">
        {currentCargo && (
          <CargoForm
            newCargo={currentCargo}
            setNewCargo={setCurrentCargo as React.Dispatch<React.SetStateAction<Cargo>>}
            handleAddCargo={handleUpdateCargo}
            handleFileChange={handleFileChange}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            isEditMode={true}
          />
        )}
      </Modal>
    </div>
  );
}