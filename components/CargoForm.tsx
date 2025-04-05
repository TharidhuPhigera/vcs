import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Cargo } from "@/app/types";
import { useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

interface CargoFormProps {
  newCargo: Cargo;
  setNewCargo: (cargo: Cargo) => void;
  handleAddCargo: (e: React.FormEvent) => Promise<void>; // Changed to return Promise
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  isEditMode?: boolean;
}

export const CargoForm: React.FC<CargoFormProps> = ({
  newCargo,
  setNewCargo,
  handleAddCargo,
  handleFileChange,
  showPassword,
  isEditMode = false,
  togglePasswordVisibility,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCargo({ ...newCargo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await handleAddCargo(e);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
      {/* Notification overlays */}
      {success && (
        <div className="absolute -top-20 left-0 right-0 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center">
            <FiCheckCircle className="mr-2" />
            <span>{isEditMode ? 'Cargo updated successfully!' : 'Cargo added successfully!'}</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute -top-20 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="cargo-form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reference Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reference Number
          </label>
          <input
            type="text"
            value={newCargo.referenceNumber}
            onChange={(e) => setNewCargo({...newCargo, referenceNumber: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border-gray-500 dark:bg-gray-800/50 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black dark:text-white border border-white/20 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 cargo-form-input"
            disabled={isEditMode}
            required
          />
        </div>
        
        {!isEditMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newCargo.password}
                onChange={(e) => setNewCargo({...newCargo, password: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border-gray-500 dark:bg-gray-800/50 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black dark:text-white border border-white/20 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 cargo-form-input"
                required={!isEditMode}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
              >
                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
            </div>
          </div>
        )}

        {/* Rest of your form fields remain the same */}
        {/* Origin */}
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
            Origin
          </label>
          <input
            type="text"
            id="origin"
            name="origin"
            value={newCargo.origin}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border-gray-500 dark:bg-gray-800/50 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black dark:text-white border border-white/20 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 cargo-form-input"
            required
          />
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={newCargo.destination}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border-gray-500 dark:bg-gray-800/50 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black dark:text-white border border-white/20 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 cargo-form-input"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={newCargo.status}
            onChange={(e) => setNewCargo({...newCargo, status: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border-gray-500 dark:bg-gray-800/50 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black dark:text-white border border-white/20 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 cargo-form-input"
            required
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {/* Estimated Delivery */}
        <div>
          <label htmlFor="estimatedDelivery" className="block text-sm font-medium text-black mb-2">
            Estimated Delivery
          </label>
          <input
            type="date"
            id="estimatedDelivery"
            name="estimatedDelivery"
            value={newCargo.estimatedDelivery}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border-gray-500 dark:bg-gray-800/50 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black dark:text-white border border-white/20 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 cargo-form-input"
            required
          />
        </div>

        {/* Unit Count */}
        <div>
          <label htmlFor="unitCount" className="block text-sm font-medium text-gray-700 mb-2">
            Unit Count
          </label>
          <input
            type="number"
            id="unitCount"
            name="unitCount"
            value={newCargo.unitCount}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border-gray-500 dark:bg-gray-800/50 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black dark:text-white border border-white/20 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 cargo-form-input"
            min="1"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-2">
            Price
          </label>
          <div className="flex items-center rounded-lg transition-all text-black">
            <span className="px-4 text-gray-700">€</span>
            <input
              type="number"
              id="payment"
              name="payment"
              value={newCargo.payment}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border-gray-500 dark:bg-gray-800/50 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black dark:text-white border border-white/20 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 cargo-form-input"
              required
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            id="file-upload"
            name="imageFile"
            accept="image/*, video/*"
            onChange={handleFileChange}
            className="w-full px-4 py-3 bg-white/10 border-gray-500 dark:bg-gray-800/50 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black dark:text-white border border-white/20 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 cargo-form-input"
          />
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <input
            type="text"
            id="note"
            name="note"
            value={newCargo.note}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border-gray-500 dark:bg-gray-800/50 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black dark:text-white border border-white/20 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 cargo-form-input"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={loading}
          className={`cargo-form-submit flex items-center justify-center gap-2 ${
            loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-700'
          } text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 min-w-[120px]`}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" />
              Processing...
            </>
          ) : isEditMode ? (
            'Update Cargo'
          ) : (
            'Add Cargo'
          )}
        </button>
      </div>
    </form>
    </div>
  );
};