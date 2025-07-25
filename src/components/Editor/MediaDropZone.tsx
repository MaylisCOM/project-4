import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Video } from 'lucide-react';

interface MediaDropZoneProps {
  onMediaDrop: (file: File, url: string) => void;
  accept?: string;
  className?: string;
  children?: React.ReactNode;
}

const MediaDropZone: React.FC<MediaDropZoneProps> = ({
  onMediaDrop,
  accept = 'image/*,video/*',
  className = '',
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const mediaFile = files.find(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (mediaFile) {
      const url = URL.createObjectURL(mediaFile);
      onMediaDrop(mediaFile, url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div
      className={`relative ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {children}
      
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center z-10">
          <div className="text-center text-blue-700">
            <Upload className="mx-auto mb-2" size={32} />
            <p className="font-medium">Déposez votre média ici</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaDropZone;