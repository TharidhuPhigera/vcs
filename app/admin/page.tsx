"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { AiOutlineEye, AiOutlineEdit, AiOutlineSearch, AiOutlineSortAscending, AiOutlineSortDescending, AiOutlineDoubleLeft, AiOutlineLeft, AiOutlineDoubleRight, AiOutlineRight } from "react-icons/ai";
import { CargoForm } from "@/components/CargoForm";
import { ViewCargoModal } from "@/components/ViewCargo";
import { Cargo } from "@/app/types";

const CARGO_API_URL = "/api/cargo";
const ITEMS_PER_PAGE = 10;

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
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Calculate pagination values
  const totalItems = filteredCargo.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = filteredCargo.slice(startIndex, endIndex);

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
    setCurrentPage(1); // Reset to first page when filters change
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

  // Pagination controls
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const firstPage = () => goToPage(1);
  const lastPage = () => goToPage(totalPages);

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
      throw error;
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
      throw error;
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
      <div className="fixed top-0 right-0 p-4 z-50">
        <button
          onClick={handleSignOut}
          className="text-white bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-black/30 transition border border-white/10 whitespace-nowrap"
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
              {currentItems.length > 0 ? (
                currentItems.map((cargo) => (
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
                          className="bg-[#00b5e2] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-[#009ec1] transition transform hover:scale-105 backdrop-blur-md"
                          title="View"
                        >
                          <AiOutlineEye className="text-sm sm:text-base" size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(cargo.referenceNumber)}
                          className="bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-green-700 transition transform hover:scale-105 backdrop-blur-md"
                          title="Edit"
                        >
                          <AiOutlineEdit className="text-sm sm:text-base" size={18} />
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-[#155E95]/30 backdrop-blur-md border-t border-white/10">
              <div className="text-sm text-white/70">
                {startIndex + 1} - {endIndex} of {totalItems}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={firstPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1 ? 'text-white/30 cursor-not-allowed' : 'text-white hover:bg-white/10'}`}
                  title="First Page"
                >
                  <AiOutlineDoubleLeft />
                </button>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1 ? 'text-white/30 cursor-not-allowed' : 'text-white hover:bg-white/10'}`}
                  title="Previous Page"
                >
                  <AiOutlineLeft />
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-8 h-8 rounded-md flex items-center justify-center ${
                          currentPage === pageNum 
                            ? 'bg-[#00b5e2] text-white' 
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-2 text-white/50">...</span>
                  )}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={lastPage}
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-white hover:bg-white/10`}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${currentPage === totalPages ? 'text-white/30 cursor-not-allowed' : 'text-white hover:bg-white/10'}`}
                  title="Next Page"
                >
                  <AiOutlineRight />
                </button>
                <button
                  onClick={lastPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${currentPage === totalPages ? 'text-white/30 cursor-not-allowed' : 'text-white hover:bg-white/10'}`}
                  title="Last Page"
                >
                  <AiOutlineDoubleRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals (keep all your existing modal code unchanged) */}
      <Modal 
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="New Cargo"
        className="max-h-[90vh] w-full max-w-[95vw] md:max-w-2xl overflow-y-auto">
          <CargoForm
            newCargo={newCargo}
            setNewCargo={setNewCargo}
            handleAddCargo={handleAddCargo}
            handleFileChange={handleFileChange}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
      </Modal>

      <Modal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)} 
        title="View Cargo Details"
        className="max-h-[90vh] w-full max-w-[95vw] md:max-w-2xl overflow-y-auto"
      >
        <ViewCargoModal viewCargo={currentCargo} />
      </Modal>

      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        title="Edit Cargo"
        className="md:max-w-2xl" 
      >
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