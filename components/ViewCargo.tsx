import { Cargo } from "@/app/types";
import { useState } from "react";
import { FaFileImage, FaFileVideo, FaFilePdf } from "react-icons/fa";
import { FileModal } from "@/components/FileModal";

interface ViewCargoModalProps {
  viewCargo: Cargo | null;
  onClose: () => void;
}

export const ViewCargoModal: React.FC<ViewCargoModalProps> = ({ viewCargo, onClose }) => {
  const [expandedFile, setExpandedFile] = useState<string | null>(null);

  if (!viewCargo) return null;

  const handleFileClick = (fileUrl: string) => {
    setExpandedFile(fileUrl);
  };

  const renderFileIcon = (fileUrl: string) => {
    const fileType = fileUrl.split(".").pop()?.toLowerCase();

    switch (fileType) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaFileImage className="text-4xl text-blue-500 hover:text-blue-700 transition-colors" />;
      case "mp4":
      case "mov":
      case "avi":
        return <FaFileVideo className="text-4xl text-red-500 hover:text-red-700 transition-colors" />;
      case "pdf":
        return <FaFilePdf className="text-4xl text-red-600 hover:text-red-800 transition-colors" />;
      default:
        return <FaFileImage className="text-4xl text-gray-500 hover:text-gray-700 transition-colors" />;
    }
  };

  // Format the estimated delivery date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 text-gray-800">
      {/* Cargo Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Reference Number</label>
          <div className="text-lg font-semibold text-gray-800">{viewCargo.referenceNumber}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
          <div className="text-lg font-semibold text-gray-800">{viewCargo.status}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Origin</label>
          <div className="text-lg font-semibold text-gray-800">{viewCargo.origin}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Destination</label>
          <div className="text-lg font-semibold text-gray-800">{viewCargo.destination}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Estimated Delivery</label>
          <div className="text-lg font-semibold text-gray-800">
            {formatDate(viewCargo.estimatedDelivery)}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Unit Count</label>
          <div className="text-lg font-semibold text-gray-800">{viewCargo.unitCount}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Payment</label>
          <div className="text-lg font-semibold text-gray-800">€{viewCargo.payment}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Note</label>
          <div className="text-lg font-semibold text-gray-800">{viewCargo.note}</div>
        </div>
      </div>

      {/* File Preview Section */}
      {viewCargo.imageUrl && (
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">File Preview</label>
          <div
            className="cursor-pointer flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => handleFileClick(viewCargo.imageUrl)}
          >
            {renderFileIcon(viewCargo.imageUrl)}
            <span className="text-sm text-gray-600 mt-2">Click to view</span>
          </div>
        </div>
      )}

      {/* File Modal for Expanded File View */}
      <FileModal
        isOpen={!!expandedFile}
        onClose={() => setExpandedFile(null)}
        fileUrl={expandedFile}
      />
    </div>
  );
};