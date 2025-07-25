import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Save,
  Upload,
  Undo,
  Redo,
  Grid,
  LogOut,
  User,
  BarChart3,
  Loader2
} from 'lucide-react';
import ComponentDropdown from '../Editor/ComponentDropdown';
import { MediaItem } from '../../types';

interface HeaderProps {
  onPreview: () => void;
  onSave: () => void;
  onPublish: () => void;
  onStats: () => void;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  isPreviewMode: boolean;
  showGrid: boolean;
  onToggleGrid: () => void;
  onComponentAdd: (componentType: string) => void;
  onLogout: () => void;
  userName: string;
  mediaLibrary?: MediaItem[];
  onAddToMediaLibrary?: (file: File, url: string) => MediaItem;
  currentProject?: any;
  isSaving?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onPreview,
  onSave,
  onPublish,
  onStats,
  viewMode,
  onViewModeChange,
  projectName,
  onProjectNameChange,
  isPreviewMode,
  showGrid,
  onToggleGrid,
  onComponentAdd,
  onLogout,
  userName,
  mediaLibrary,
  onAddToMediaLibrary,
  currentProject,
  isSaving = false
}) => {
  const viewModeIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between"
      style={{ backgroundColor: '#F0E8BB' }}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          {currentProject?.branding?.logo ? (
            <img
              src={currentProject.branding.logo}
              alt="Logo"
              className="w-8 h-8 object-contain"
            />
          ) : (
            <div className="w-8 h-8 gradient-lavender-violet rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
          )}
          <span className="text-xl font-bold theme-dark">
            {currentProject?.branding?.companyName || 'la ou pala'}
          </span>
        </div>
        
      </div>

      {/* Center Section - View Mode Controls */}
      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
        {Object.entries(viewModeIcons).map(([mode, Icon]) => (
          <motion.button
            key={mode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewModeChange(mode as 'desktop' | 'tablet' | 'mobile')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === mode
                ? 'bg-white shadow-sm theme-violet'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon size={18} />
          </motion.button>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors text-gray-600"
        >
          <Undo size={18} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors text-gray-600"
        >
          <Redo size={18} />
        </motion.button>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />
        
        <motion.button
          onClick={onToggleGrid}
          whileHover={{ scale: 1.1 }}
          className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-white bg-opacity-70 theme-violet' : 'text-gray-600 hover:bg-white hover:bg-opacity-50'}`}
          title="Afficher/masquer la grille"
        >
          <Grid size={18} />
        </motion.button>
        
        <motion.button
          onClick={onPreview}
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-50 hover:bg-opacity-70 rounded-lg transition-colors theme-dark"
        >
          <Eye size={18} />
          <span className="text-sm font-medium">
            {isPreviewMode ? 'Éditer' : 'Aperçu'}
          </span>
        </motion.button>
        
        <motion.button
          onClick={onStats}
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-50 hover:bg-opacity-70 rounded-lg transition-colors theme-dark"
        >
          <BarChart3 size={18} />
          <span className="text-sm font-medium">Stats</span>
        </motion.button>
        
        <motion.button
          onClick={onSave}
          disabled={isSaving}
          whileHover={{ scale: isSaving ? 1 : 1.05 }}
          className={`flex items-center space-x-2 px-3 py-2 gradient-lavender-violet text-white rounded-lg hover:shadow-lg transition-all ${
            isSaving ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSaving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          <span className="text-sm font-medium">
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </span>
        </motion.button>
        
        <motion.button
          onClick={onPublish}
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Upload size={18} />
          <span className="text-sm font-medium">Publier</span>
        </motion.button>

        <div className="h-6 w-px bg-gray-300 mx-2" />
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User size={16} />
            <span>{userName}</span>
          </div>
          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.1 }}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors text-gray-600"
            title="Se déconnecter"
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

// Fonctions utilitaires pour les composants par défaut
const getDefaultContent = (type: string) => {
  switch (type) {
    case 'header':
      return { text: 'Titre principal', level: 1 };
    case 'text':
      return { text: 'Votre texte ici...' };
    case 'button':
      return { text: 'Cliquez ici', href: '#' };
    case 'image':
      return { src: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Image' };
    default:
      return {};
  }
};

const getDefaultStyles = (type: string) => {
  switch (type) {
    case 'header':
      return {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: '1rem 0'
      };
    case 'text':
      return {
        fontSize: '1rem',
        color: '#374151',
        lineHeight: '1.6',
        margin: '0.5rem 0'
      };
    case 'button':
      return {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: '500'
      };
    default:
      return {};
  }
};

export default Header;