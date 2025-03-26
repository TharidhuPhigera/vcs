import React, { useState, useRef, useEffect } from "react";

interface FileModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string | null;
}

export const FileModal: React.FC<FileModalProps> = ({ isOpen, onClose, fileUrl }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset states when modal closes or file changes
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setProgress(0);
      setIsFullscreen(false);
    }
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case " ":
          if (isVideoFile) togglePlayPause();
          break;
        case "f":
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, fileUrl]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleFullscreen = () => {
    if (!modalRef.current) return;

    if (!isFullscreen) {
      modalRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  if (!isOpen || !fileUrl) return null;

  const fileExtension = fileUrl.split(".").pop()?.toLowerCase();
  const isVideoFile = ["mp4", "mov", "avi", "webm"].includes(fileExtension || "");
  const isImageFile = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "");
  const isPDFFile = fileExtension === "pdf";

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className={`bg-gray-900 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${isFullscreen ? "w-screen h-screen m-0 rounded-none" : "w-full max-w-6xl mx-4"}`}>
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 bg-gray-800">
          <h2 className="text-lg font-medium text-white truncate max-w-[70%]">
            {fileUrl.split("/").pop()}
          </h2>
          <div className="flex items-center space-x-3">
            {isVideoFile && (
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300 transition-colors"
                title={isFullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}
              >
                {isFullscreen ? "⛶" : "⛶"}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-xl p-1 transition-colors"
              title="Close (Esc)"
            >
              ✖
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex items-center justify-center p-2 bg-black">
          {isVideoFile ? (
            <div className="w-full relative group">
              <video
                ref={videoRef}
                src={fileUrl}
                className="max-h-[80vh] w-auto max-w-full"
                onClick={togglePlayPause}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                controls={false} // We'll use custom controls
              />
              
              {/* Custom Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlayPause}
                    className="text-white hover:text-gray-300 text-2xl"
                  >
                    {isPlaying ? "❚❚" : "▶"}
                  </button>
                  
                  <div className="flex-1">
                    <div 
                      className="h-1 bg-gray-600 rounded-full cursor-pointer"
                      onClick={handleProgressClick}
                    >
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <span className="text-white text-sm">
                    {videoRef.current?.currentTime
                      ? `${Math.floor(videoRef.current.currentTime / 60)}:${Math.floor(videoRef.current.currentTime % 60).toString().padStart(2, '0')}`
                      : "0:00"}
                  </span>
                </div>
              </div>
            </div>
          ) : isImageFile ? (
            <img
              src={fileUrl}
              alt="Preview"
              className="max-h-[80vh] max-w-full object-contain cursor-zoom-in"
              onClick={toggleFullscreen}
            />
          ) : isPDFFile ? (
            <iframe
              src={fileUrl}
              className="w-full h-[80vh] border-0"
              title="PDF Preview"
            />
          ) : (
            <div className="p-8 text-center text-white">
              <p className="text-xl">Unsupported file format</p>
              <a
                href={fileUrl}
                download
                className="mt-4 inline-block px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};