import { Cargo } from "@/app/types";
import { useState } from "react";
import { FaFileImage, FaFileVideo, FaFilePdf } from "react-icons/fa";
import { FileModal } from "@/components/FileModal";

interface ViewCargoModalProps {
  viewCargo: Cargo | null;
}

export const ViewCargoModal: React.FC<ViewCargoModalProps> = ({ viewCargo }) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Reference Number", value: viewCargo.referenceNumber },
          { label: "Status", value: viewCargo.status },
          { label: "Origin", value: viewCargo.origin },
          { label: "Destination", value: viewCargo.destination },
          { label: "Estimated Delivery", value: formatDate(viewCargo.estimatedDelivery) },
          { label: "Unit Count", value: viewCargo.unitCount },
          { label: "Payment", value: `€${viewCargo.payment}` },
          { label: "Note", value: viewCargo.note }
        ].map((item) => (
          <div key={item.label}>
            <label className="block text-sm font-medium text-gray-600 mb-1">{item.label}</label>
            <div className="text-lg font-semibold text-gray-800">{item.value}</div>
          </div>
        ))}
      </div>

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

      <FileModal
        isOpen={!!expandedFile}
        onClose={() => setExpandedFile(null)}
        fileUrl={expandedFile}
      />
    </div>
  );
};