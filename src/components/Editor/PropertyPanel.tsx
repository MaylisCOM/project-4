import React, { useState } from 'react';
import { 
  X, 
  ChevronDown, 
  ChevronRight, 
  Type, 
  Palette, 
  Layout, 
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Image as ImageIcon,
  Video,
  Settings
} from 'lucide-react';
import { Component } from '../../types';
import MediaLibrary from '../Media/MediaLibrary';

interface PropertyPanelProps {
  component: Component;
  onUpdate: (updates: Partial<Component>) => void;
  onClose: () => void;
  mediaLibrary?: MediaItem[];
  onAddToMediaLibrary?: (file: File, url: string) => MediaItem;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  component,
  onUpdate,
  onClose,
  mediaLibrary = [],
  onAddToMediaLibrary
}) => {
  const [openSections, setOpenSections] = useState<string[]>(['content', 'style', 'responsive']);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentViewMode, setCurrentViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleStyleChange = (property: string, value: any) => {
    const currentStyles = component.styles || {};
    
    if (currentViewMode === 'desktop') {
      onUpdate({
        styles: {
          ...currentStyles,
          [property]: value
        }
      });
    } else {
      // Pour tablette et mobile, on stocke dans les styles responsive
      const responsiveKey = currentViewMode as 'tablet' | 'mobile';
      const currentResponsiveStyles = currentStyles[responsiveKey] || {};
      
      onUpdate({
        styles: {
          ...currentStyles,
          [responsiveKey]: {
            ...currentResponsiveStyles,
            [property]: value
          }
        }
      });
    }
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    if (currentViewMode === 'desktop') {
      onUpdate({
        position: {
          ...component.position,
          [axis]: value
        }
      });
    } else {
      const currentResponsivePosition = component.responsivePosition || {};
      const viewModePosition = currentResponsivePosition[currentViewMode] || component.position;
      
      onUpdate({
        responsivePosition: {
          ...currentResponsivePosition,
          [currentViewMode]: {
            ...viewModePosition,
            [axis]: value
          }
        }
      });
    }
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: string) => {
    if (currentViewMode === 'desktop') {
      onUpdate({
        size: {
          ...component.size,
          [dimension]: value
        }
      });
    } else {
      const currentResponsiveSize = component.responsiveSize || {};
      const viewModeSize = currentResponsiveSize[currentViewMode] || component.size;
      
      onUpdate({
        responsiveSize: {
          ...currentResponsiveSize,
          [currentViewMode]: {
            ...viewModeSize,
            [dimension]: value
          }
        }
      });
    }
  };

  const getCurrentStyles = () => {
    if (currentViewMode === 'desktop') {
      return component.styles || {};
    }
    return {
      ...(component.styles || {}),
      ...(component.styles?.[currentViewMode] || {})
    };
  };

  const getCurrentPosition = () => {
    if (currentViewMode === 'desktop') {
      return component.position;
    }
    return component.responsivePosition?.[currentViewMode] || component.position;
  };

  const getCurrentSize = () => {
    if (currentViewMode === 'desktop') {
      return component.size;
    }
    return component.responsiveSize?.[currentViewMode] || component.size;
  };

  const handleMediaSelect = (media: MediaItem) => {
    if (component.type === 'image') {
      onUpdate({
        content: {
          ...component.content,
          src: media.url,
          alt: media.name
        }
      });
    } else if (component.type === 'video') {
      onUpdate({
        content: {
          ...component.content,
          src: media.url
        }
      });
    }
    setShowMediaLibrary(false);
  };

  const currentStyles = getCurrentStyles();
  const currentPosition = getCurrentPosition();
  const currentSize = getCurrentSize();

  const viewModeIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };

  return (
    <>
      <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Propriétés</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Section Responsive */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('responsive')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <Smartphone size={16} className="text-blue-600" />
                <span className="font-medium text-sm">Responsive</span>
              </div>
              {openSections.includes('responsive') ? 
                <ChevronDown size={16} /> : <ChevronRight size={16} />
              }
            </button>
            
            {openSections.includes('responsive') && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                {/* Sélecteur de vue */}
                <div className="mb-4">
                  <label className="block text-xs font-medium mb-2">Mode d'affichage</label>
                  <div className="flex bg-white rounded-lg p-1 border">
                    {Object.entries(viewModeIcons).map(([mode, Icon]) => (
                      <button
                        key={mode}
                        onClick={() => setCurrentViewMode(mode as 'desktop' | 'tablet' | 'mobile')}
                        className={`flex-1 flex items-center justify-center p-2 rounded-md transition-colors ${
                          currentViewMode === mode
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon size={16} />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Modifiez le design pour {currentViewMode === 'desktop' ? 'ordinateur' : currentViewMode === 'tablet' ? 'tablette' : 'mobile'}
                  </p>
                </div>

                {/* Indicateur du mode actuel */}
                <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    {React.createElement(viewModeIcons[currentViewMode], { size: 14, className: "text-blue-600" })}
                    <span className="text-xs font-medium text-blue-800">
                      Édition {currentViewMode === 'desktop' ? 'Desktop' : currentViewMode === 'tablet' ? 'Tablette' : 'Mobile'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Les modifications s'appliquent uniquement à cette vue
                  </p>
                </div>

                {/* Position responsive */}
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-2">Position ({currentViewMode})</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">X</label>
                      <input
                        type="number"
                        value={currentPosition.x}
                        onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                        className="w-full p-2 text-xs border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Y</label>
                      <input
                        type="number"
                        value={currentPosition.y}
                        onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                        className="w-full p-2 text-xs border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Taille responsive */}
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-2">Taille ({currentViewMode})</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Largeur</label>
                      <input
                        type="text"
                        value={currentSize.width}
                        onChange={(e) => handleSizeChange('width', e.target.value)}
                        className="w-full p-2 text-xs border border-gray-300 rounded"
                        placeholder="auto, 100px, 50%"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Hauteur</label>
                      <input
                        type="text"
                        value={currentSize.height}
                        onChange={(e) => handleSizeChange('height', e.target.value)}
                        className="w-full p-2 text-xs border border-gray-300 rounded"
                        placeholder="auto, 100px, 50%"
                      />
                    </div>
                  </div>
                </div>

                {/* Presets responsive */}
                <div>
                  <label className="block text-xs font-medium mb-2">Presets rapides</label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => {
                        if (currentViewMode === 'mobile') {
                          handleStyleChange('fontSize', '14px');
                          handleStyleChange('padding', '8px');
                        }
                      }}
                      className="p-2 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Mobile optimisé
                    </button>
                    <button
                      onClick={() => {
                        if (currentViewMode === 'tablet') {
                          handleStyleChange('fontSize', '16px');
                          handleStyleChange('padding', '12px');
                        }
                      }}
                      className="p-2 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Tablette optimisé
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section Contenu */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('content')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <Type size={16} className="text-green-600" />
                <span className="font-medium text-sm">Contenu</span>
              </div>
              {openSections.includes('content') ? 
                <ChevronDown size={16} /> : <ChevronRight size={16} />
              }
            </button>
            
            {openSections.includes('content') && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                {component.type === 'header' && (
                  <>
                    <div className="mb-3">
                      <label className="block text-xs font-medium mb-2">Texte</label>
                      <input
                        type="text"
                        value={component.content?.text || ''}
                        onChange={(e) => onUpdate({
                          content: { ...component.content, text: e.target.value }
                        })}
                        className="w-full p-2 text-xs border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-2">Niveau</label>
                      <select
                        value={component.content?.level || 1}
                        onChange={(e) => onUpdate({
                          content: { ...component.content, level: parseInt(e.target.value) }
                        })}
                        className="w-full p-2 text-xs border border-gray-300 rounded"
                      >
                        <option value={1}>H1</option>
                        <option value={2}>H2</option>
                        <option value={3}>H3</option>
                        <option value={4}>H4</option>
                        <option value={5}>H5</option>
                        <option value={6}>H6</option>
                      </select>
                    </div>
                  </>
                )}

                {component.type === 'text' && (
                  <div>
                    <label className="block text-xs font-medium mb-2">Texte</label>
                    <textarea
                      value={component.content?.text || ''}
                      onChange={(e) => onUpdate({
                        content: { ...component.content, text: e.target.value }
                      })}
                      className="w-full p-2 text-xs border border-gray-300 rounded h-20 resize-none"
                    />
                  </div>
                )}

                {component.type === 'button' && (
                  <>
                    <div className="mb-3">
                      <label className="block text-xs font-medium mb-2">Texte du bouton</label>
                      <input
                        type="text"
                        value={component.content?.text || ''}
                        onChange={(e) => onUpdate({
                          content: { ...component.content, text: e.target.value }
                        })}
                        className="w-full p-2 text-xs border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-2">Lien</label>
                      <input
                        type="text"
                        value={component.content?.href || ''}
                        onChange={(e) => onUpdate({
                          content: { ...component.content, href: e.target.value }
                        })}
                        className="w-full p-2 text-xs border border-gray-300 rounded"
                        placeholder="https://..."
                      />
                    </div>
                  </>
                )}

                {(component.type === 'image' || component.type === 'video') && (
                  <>
                    <div className="mb-3">
                      <label className="block text-xs font-medium mb-2">Source</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={component.content?.src || ''}
                          onChange={(e) => onUpdate({
                            content: { ...component.content, src: e.target.value }
                          })}
                          className="flex-1 p-2 text-xs border border-gray-300 rounded"
                          placeholder="URL ou chemin"
                        />
                        <button
                          onClick={() => setShowMediaLibrary(true)}
                          className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          {component.type === 'image' ? <ImageIcon size={14} /> : <Video size={14} />}
                        </button>
                      </div>
                    </div>
                    {component.type === 'image' && (
                      <div>
                        <label className="block text-xs font-medium mb-2">Texte alternatif</label>
                        <input
                          type="text"
                          value={component.content?.alt || ''}
                          onChange={(e) => onUpdate({
                            content: { ...component.content, alt: e.target.value }
                          })}
                          className="w-full p-2 text-xs border border-gray-300 rounded"
                          placeholder="Description de l'image"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Section Style */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('style')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <Palette size={16} className="text-purple-600" />
                <span className="font-medium text-sm">Style ({currentViewMode})</span>
              </div>
              {openSections.includes('style') ? 
                <ChevronDown size={16} /> : <ChevronRight size={16} />
              }
            </button>
            
            {openSections.includes('style') && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-2">Couleur de fond</label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={currentStyles.backgroundColor || '#ffffff'}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={currentStyles.backgroundColor || ''}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="flex-1 p-2 text-xs border border-gray-300 rounded"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-2">Couleur du texte</label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={currentStyles.color || '#000000'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={currentStyles.color || ''}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        className="flex-1 p-2 text-xs border border-gray-300 rounded"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-xs font-medium mb-2">Taille de police</label>
                    <input
                      type="text"
                      value={currentStyles.fontSize || ''}
                      onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                      className="w-full p-2 text-xs border border-gray-300 rounded"
                      placeholder="16px, 1rem, 1.2em"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-2">Alignement</label>
                    <select
                      value={currentStyles.textAlign || 'left'}
                      onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                      className="w-full p-2 text-xs border border-gray-300 rounded"
                    >
                      <option value="left">Gauche</option>
                      <option value="center">Centre</option>
                      <option value="right">Droite</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-xs font-medium mb-2">Padding</label>
                    <input
                      type="text"
                      value={currentStyles.padding || ''}
                      onChange={(e) => handleStyleChange('padding', e.target.value)}
                      className="w-full p-2 text-xs border border-gray-300 rounded"
                      placeholder="10px, 1rem"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-2">Margin</label>
                    <input
                      type="text"
                      value={currentStyles.margin || ''}
                      onChange={(e) => handleStyleChange('margin', e.target.value)}
                      className="w-full p-2 text-xs border border-gray-300 rounded"
                      placeholder="10px, 1rem"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-medium mb-2">Border Radius</label>
                  <input
                    type="text"
                    value={currentStyles.borderRadius || ''}
                    onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                    className="w-full p-2 text-xs border border-gray-300 rounded"
                    placeholder="0px, 5px, 50%"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section Layout */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('layout')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <Layout size={16} className="text-orange-600" />
                <span className="font-medium text-sm">Layout</span>
              </div>
              {openSections.includes('layout') ? 
                <ChevronDown size={16} /> : <ChevronRight size={16} />
              }
            </button>
            
            {openSections.includes('layout') && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-2">Z-Index</label>
                    <input
                      type="number"
                      value={currentStyles.zIndex || 0}
                      onChange={(e) => handleStyleChange('zIndex', parseInt(e.target.value) || 0)}
                      className="w-full p-2 text-xs border border-gray-300 rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-2">Opacité</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={currentStyles.opacity || 1}
                      onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">{currentStyles.opacity || 1}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibrary
          isOpen={showMediaLibrary}
          onClose={() => setShowMediaLibrary(false)}
          onSelectMedia={handleMediaSelect}
          currentMedia={component.content?.src}
          mediaLibrary={mediaLibrary}
          onAddToMediaLibrary={onAddToMediaLibrary || (() => ({} as MediaItem))}
        />
      )}
    </>
  );
};

export default PropertyPanel;