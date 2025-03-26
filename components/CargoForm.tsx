import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Cargo } from "@/app/types"; // Import the Cargo type

interface CargoFormProps {
  newCargo: Cargo;
  setNewCargo: (cargo: Cargo) => void;
  handleAddCargo: (e: React.FormEvent) => void;
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCargo({ ...newCargo, [name]: value });
  };

  return (
    <form onSubmit={handleAddCargo} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reference Number */}
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reference Number
        </label>
        <input
          type="text"
          value={newCargo.referenceNumber}
          onChange={(e) => setNewCargo({...newCargo, referenceNumber: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
          disabled={isEditMode} // Disabled when editing
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
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
          <label htmlFor="estimatedDelivery" className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Delivery
          </label>
          <input
            type="date"
            id="estimatedDelivery"
            name="estimatedDelivery"
            value={newCargo.estimatedDelivery}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
            min="1"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-2">
            Price
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all text-black">
            <span className="px-4 text-gray-700">€</span>
            <input
              type="number"
              id="payment"
              name="payment"
              value={newCargo.payment}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-0 focus:ring-0"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          {isEditMode ? 'Update Cargo' : 'Add Cargo'}
        </button>
      </div>
    </form>
  );
};