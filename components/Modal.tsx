import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; // New prop for dynamic title
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  // Close the modal when clicking outside of it
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick} // Close modal when clicking outside
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl p-2 -m-2 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;