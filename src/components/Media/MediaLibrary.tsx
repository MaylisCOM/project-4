import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Trash2, 
  Search, 
  Filter,
  X,
  FolderPlus,
  Grid,
  List
} from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: Date;
  folder?: string;
}

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (media: MediaItem) => void;
  currentMedia?: string;
  mediaLibrary: MediaItem[];
  onAddToMediaLibrary: (file: File, url: string) => MediaItem;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({
  isOpen,
  onClose,
  onSelectMedia,
  currentMedia,
  mediaLibrary,
  onAddToMediaLibrary
}) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mediaLibrary);
  
  // Synchroniser avec la bibliothèque globale
  React.useEffect(() => {
    setMediaItems(mediaLibrary);
  }, [mediaLibrary]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        onAddToMediaLibrary(file, url);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDeleteMedia = (id: string) => {
    // Note: Pour une vraie application, il faudrait aussi supprimer de la bibliothèque globale
    // Pour l'instant, on supprime seulement localement
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bibliothèque de médias</h2>
            <p className="text-sm text-gray-600 mt-1">Cliquez sur un média pour le sélectionner</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-gray-600 mb-2">
              Glissez-déposez vos fichiers ici ou{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                parcourez
              </button>
            </p>
            <p className="text-sm text-gray-500">
              Formats supportés: JPG, PNG, GIF, MP4, WebM
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as 'all' | 'image' | 'video')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les médias</option>
                <option value="image">Images</option>
                <option value="video">Vidéos</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Media Grid/List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun média trouvé</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez par uploader vos premiers médias'}
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-2'
            }>
              {filteredMedia.map((media) => (
                <div
                  key={media.id}
                  className={`group relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer ${
                    currentMedia === media.url ? 'ring-2 ring-blue-500' : ''
                  } ${
                    viewMode === 'grid' ? 'aspect-square' : 'flex items-center p-3'
                  }`}
                  onClick={() => {
                    console.log('Clic sur média:', media);
                    onSelectMedia(media);
                  }}
                >
                  {viewMode === 'grid' ? (
                    <>
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Video className="text-gray-400" size={32} />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                             console.log('Clic sur bouton sélectionner:', media);
                              onSelectMedia(media);
                            }}
                            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Sélectionner
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMedia(media.id);
                            }}
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-medium truncate">{media.name}</p>
                        <p className="text-white/80 text-xs">{formatFileSize(media.size)}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={media.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Video className="text-gray-400" size={20} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{media.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(media.size)} • {media.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                         console.log('Clic sur bouton sélectionner (liste):', media);
                          onSelectMedia(media);
                        }}
                        className="opacity-0 group-hover:opacity-100 mr-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-all"
                      >
                        Sélectionner
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMedia(media.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {filteredMedia.length} média{filteredMedia.length > 1 ? 's' : ''} trouvé{filteredMedia.length > 1 ? 's' : ''}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;