import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  className = "",
  overlayClassName = ""
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 backdrop-blur-sm transition-opacity duration-300 overflow-y-auto py-8 ${overlayClassName}`}
      onClick={handleBackdropClick}
    >
      <div className={`relative bg-white rounded-xl shadow-2xl w-full max-w-[95vw] mx-4 my-8 flex flex-col ${className}`} style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        {/* Modal Header */}
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl md:text-3xl p-1 -m-2 transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Modal Body - Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;