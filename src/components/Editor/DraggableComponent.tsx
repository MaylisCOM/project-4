import React from 'react';
import { 
  Play, Pause, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Star, Quote, Calendar, MapPin, Send, ThumbsUp, FileText, ImageIcon,
  BarChart3, Eye, Mountain, MousePointer
} from 'lucide-react';
import { Component } from '../../types';
import MediaDropZone from './MediaDropZone';

interface DraggableComponentProps {
  component: Component;
  isSelected: boolean;
  onUpdate: (updates: Partial<Component>) => void;
  onSelect: () => void;
  isPreviewMode: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  snapToGrid?: boolean;
  mediaLibrary?: MediaItem[];
  onAddToMediaLibrary?: (file: File, url: string) => MediaItem;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
  isSelected,
  onUpdate,
  onSelect,
  isPreviewMode,
  viewMode,
  snapToGrid = true,
  mediaLibrary,
  onAddToMediaLibrary
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const [resizeHandle, setResizeHandle] = React.useState<string>('');
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = React.useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = React.useState({ width: 0, height: 0 });
  const [initialMousePos, setInitialMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreviewMode || component.locked) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition(component.position);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    if (isPreviewMode || component.locked) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeHandle(handle);
    setInitialMousePos({ x: e.clientX, y: e.clientY });
    
    // Get current size
    const currentWidth = parseInt(component.size.width) || 300;
    const currentHeight = parseInt(component.size.height) || 200;
    setInitialSize({ width: currentWidth, height: currentHeight });
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;

    e.preventDefault();
    
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      let newX = initialPosition.x + deltaX;
      let newY = initialPosition.y + deltaY;

      // Empêcher les positions négatives
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);
      if (snapToGrid) {
        newX = Math.round(newX / 20) * 20;
        newY = Math.round(newY / 20) * 20;
      }

      onUpdate({
        position: { x: newX, y: newY }
      });
    }

    if (isResizing) {
      const deltaX = e.clientX - initialMousePos.x;
      const deltaY = e.clientY - initialMousePos.y;
      
      let newWidth = initialSize.width;
      let newHeight = initialSize.height;
      
      switch (resizeHandle) {
        case 'se': // bottom-right
          newWidth = Math.max(50, initialSize.width + deltaX);
          newHeight = Math.max(50, initialSize.height + deltaY);
          break;
        case 'sw': // bottom-left
          newWidth = Math.max(50, initialSize.width - deltaX);
          newHeight = Math.max(50, initialSize.height + deltaY);
          break;
        case 'ne': // top-right
          newWidth = Math.max(50, initialSize.width + deltaX);
          newHeight = Math.max(50, initialSize.height - deltaY);
          break;
        case 'nw': // top-left
          newWidth = Math.max(50, initialSize.width - deltaX);
          newHeight = Math.max(50, initialSize.height - deltaY);
          break;
        case 'e': // right
          newWidth = Math.max(50, initialSize.width + deltaX);
          break;
        case 'w': // left
          newWidth = Math.max(50, initialSize.width - deltaX);
          break;
        case 's': // bottom
          newHeight = Math.max(50, initialSize.height + deltaY);
          break;
        case 'n': // top
          newHeight = Math.max(50, initialSize.height - deltaY);
          break;
      }
      
      if (snapToGrid) {
        newWidth = Math.round(newWidth / 20) * 20;
        newHeight = Math.round(newHeight / 20) * 20;
      }
      
      onUpdate({
        size: { 
          width: `${newWidth}px`, 
          height: `${newHeight}px` 
        }
      });
    }
  }, [isDragging, isResizing, dragStart, initialPosition, initialMousePos, initialSize, resizeHandle, snapToGrid, onUpdate]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDragging ? 'grabbing' : 'nw-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isPreviewMode && !isDragging && !isResizing) {
      e.stopPropagation();
      onSelect();
    }
  };

  // Fonction pour obtenir les styles selon le mode d'affichage
  const getResponsiveStyles = () => {
    const baseStyles = component.styles || {};
    
    if (viewMode === 'desktop') {
      return baseStyles;
    }
    
    // Pour tablette et mobile, on combine les styles de base avec les styles spécifiques
    const responsiveStyles = baseStyles[viewMode] || {};
    return {
      ...baseStyles,
      ...responsiveStyles
    };
  };

  // Fonction pour obtenir la position selon le mode d'affichage
  const getResponsivePosition = () => {
    if (viewMode === 'desktop') {
      return component.position;
    }
    
    return component.responsivePosition?.[viewMode] || component.position;
  };

  // Fonction pour obtenir la taille selon le mode d'affichage
  const getResponsiveSize = () => {
    if (viewMode === 'desktop') {
      return component.size;
    }
    
    return component.responsiveSize?.[viewMode] || component.size;
  };

  const isResizable = component.type === 'image' || component.type === 'video';

  const getResizeCursor = (handle: string) => {
    switch (handle) {
      case 'nw':
      case 'se':
        return 'nw-resize';
      case 'ne':
      case 'sw':
        return 'ne-resize';
      case 'n':
      case 's':
        return 'ns-resize';
      case 'e':
      case 'w':
        return 'ew-resize';
      default:
        return 'default';
    }
  };

  const renderComponent = () => {
    const responsiveStyles = getResponsiveStyles();
    
    switch (component.type) {
      case 'header':
        const HeaderTag = `h${component.content.level || 1}` as keyof JSX.IntrinsicElements;
        return (
          <HeaderTag style={responsiveStyles}>
            {component.content.text}
          </HeaderTag>
        );
      
      case 'text':
        return (
          <p style={responsiveStyles}>
            {component.content.text}
          </p>
        );
      
      case 'button':
        return (
          <button
            style={responsiveStyles}
            onClick={(e) => {
              if (!isPreviewMode) e.preventDefault();
            }}
          >
            {component.content.text}
          </button>
        );
      
      case 'image':
        return (
          <MediaDropZone
            onMediaDrop={(file, url) => {
              if (onAddToMediaLibrary) {
                onAddToMediaLibrary(file, url);
              }
              onUpdate({ content: { ...component.content, src: url } });
            }}
            accept="image/*"
            className="w-full h-full"
          >
            {component.content.src ? (
              <img
                key={`${component.content.src}-${Date.now()}`}
                src={component.content.src}
                alt={component.content.alt || 'Image'}
                style={{
                  width: '100%',
                  height: 'auto',
                  ...responsiveStyles
                }}
                onDragStart={(e) => e.preventDefault()}
                onError={(e) => {
                  console.error('Erreur de chargement image:', component.content.src);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Image chargée avec succès:', component.content.src);
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <ImageIcon size={48} className="mx-auto mb-2" />
                  <p className="text-sm">Aucune image sélectionnée</p>
                </div>
              </div>
            )}
          </MediaDropZone>
        );
      
      case 'video':
        return (
          <MediaDropZone
            onMediaDrop={(file, url) => {
              if (onAddToMediaLibrary) {
                onAddToMediaLibrary(file, url);
              }
              onUpdate({ content: { ...component.content, src: url } });
            }}
            accept="video/*"
            className="w-full h-full"
          >
            <div className="video-container" style={responsiveStyles}>
              {component.content.type === 'youtube' ? (
                <iframe
                  src={component.content.src}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: responsiveStyles.borderRadius }}
                />
              ) : (
                <video
                  src={component.content.src}
                  controls={component.content.controls}
                  autoPlay={component.content.autoplay}
                  style={{ width: '100%', height: '100%', borderRadius: responsiveStyles.borderRadius }}
                />
              )}
            </div>
          </MediaDropZone>
        );

      case 'separator':
        return (
          <hr 
            style={{
              ...responsiveStyles,
              border: 'none',
              borderTop: `${component.content.thickness}px ${component.content.style} currentColor`,
              margin: '20px 0'
            }} 
          />
        );

      case 'icon':
        return (
          <div className="flex justify-center" style={responsiveStyles}>
            <Star 
              size={component.content.size} 
              color={component.content.color}
              style={{ ...responsiveStyles }}
            />
          </div>
        );

      case 'quote':
        return (
          <blockquote className="border-l-4 border-blue-500 pl-6 py-4" style={responsiveStyles}>
            <div className="flex items-start space-x-3">
              <Quote className="text-blue-500 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-lg italic text-gray-700 mb-3">"{component.content.text}"</p>
                <footer className="text-sm text-gray-600">
                  <strong>{component.content.author}</strong>
                  {component.content.company && (
                    <span>, {component.content.company}</span>
                  )}
                </footer>
              </div>
            </div>
          </blockquote>
        );

      case 'gallery':
        return (
          <MediaDropZone
            onMediaDrop={(file, url) => {
              if (onAddToMediaLibrary) {
                onAddToMediaLibrary(file, url);
              }
              // Ajouter la nouvelle image à la galerie
              const newImage = { src: url, alt: file.name };
              const updatedImages = [...component.content.images, newImage];
              onUpdate({ content: { ...component.content, images: updatedImages } });
            }}
            accept="image/*"
            className="w-full h-full"
          >
            <div className="gallery" style={responsiveStyles}>
              <div 
                className={`grid ${
                  component.content.layout === 'grid' 
                    ? `grid-cols-${component.content.columns || 3}` 
                    : 'grid-cols-1'
                }`}
                style={{ gap: component.content.gap || '16px' }}
              >
                {component.content.images.map((image: any, index: number) => (
                  <img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer shadow-md"
                  />
                ))}
                {component.content.images.length === 0 && (
                  <div className="col-span-full flex items-center justify-center h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center text-gray-500">
                      <ImageIcon size={48} className="mx-auto mb-2" />
                      <p className="text-sm">Glissez des images ici ou utilisez les contrôles</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </MediaDropZone>
        );

      case 'carousel':
        const [currentSlide, setCurrentSlide] = React.useState(0);
        return (
          <MediaDropZone
            onMediaDrop={(file, url) => {
              if (onAddToMediaLibrary) {
                onAddToMediaLibrary(file, url);
              }
              // Ajouter un nouveau slide
              const newSlide = { image: url, title: 'Nouveau slide', description: 'Description du slide' };
              const updatedSlides = [...component.content.slides, newSlide];
              onUpdate({ content: { ...component.content, slides: updatedSlides } });
            }}
            accept="image/*,video/*"
            className="w-full h-full"
          >
            <div className="carousel relative" style={responsiveStyles}>
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={component.content.slides[currentSlide]?.image}
                  alt={component.content.slides[currentSlide]?.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-white text-xl font-bold mb-2">
                    {component.content.slides[currentSlide]?.title}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {component.content.slides[currentSlide]?.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentSlide(prev => 
                  prev === 0 ? component.content.slides.length - 1 : prev - 1
                )}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentSlide(prev => 
                  prev === component.content.slides.length - 1 ? 0 : prev + 1
                )}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </MediaDropZone>
        );

      case 'accordion':
        const [openItems, setOpenItems] = React.useState<number[]>([]);
        return (
          <div className="accordion space-y-2" style={responsiveStyles}>
            {component.content.items.map((item: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setOpenItems(prev => 
                    prev.includes(index) 
                      ? prev.filter(i => i !== index)
                      : [...prev, index]
                  )}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                >
                  <span className="font-medium">{item.title}</span>
                  {openItems.includes(index) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openItems.includes(index) && (
                  <div className="px-4 pb-4 text-gray-600">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'tabs':
        const [activeTab, setActiveTab] = React.useState(0);
        return (
          <div className="tabs" style={responsiveStyles}>
            <div className="flex border-b border-gray-200">
              {component.content.tabs.map((tab: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === index
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>
            <div className="p-4">
              {component.content.tabs[activeTab]?.content}
            </div>
          </div>
        );

      case 'counter':
        const [count, setCount] = React.useState(0);
        React.useEffect(() => {
          const timer = setTimeout(() => {
            if (count < component.content.value) {
              setCount(prev => Math.min(prev + Math.ceil(component.content.value / 100), component.content.value));
            }
          }, component.content.duration / 100);
          return () => clearTimeout(timer);
        }, [count, component.content.value, component.content.duration]);

        return (
          <div className="counter text-center" style={responsiveStyles}>
            <div className="text-4xl font-bold text-blue-600 mb-2">{count}</div>
            <div className="text-gray-600">{component.content.label}</div>
          </div>
        );

      case 'form':
        return (
          <form className="form space-y-4" style={responsiveStyles}>
            {component.content.fields.map((field: any, index: number) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    required={field.required}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {component.content.submitText}
            </button>
          </form>
        );

      case 'map':
        return (
          <div className="map bg-gray-200 rounded-lg flex items-center justify-center" style={{ height: '300px', ...responsiveStyles }}>
            <div className="text-center text-gray-600">
              <MapPin size={48} className="mx-auto mb-2" />
              <p className="font-medium">{component.content.address}</p>
              <p className="text-sm">Carte interactive</p>
            </div>
          </div>
        );

      case 'newsletter':
        return (
          <div className="newsletter bg-blue-50 p-6 rounded-lg text-center" style={responsiveStyles}>
            <h3 className="text-xl font-bold mb-2">{component.content.title}</h3>
            <p className="text-gray-600 mb-4">{component.content.description}</p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder={component.content.placeholder}
                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Send size={16} />
                <span>{component.content.buttonText}</span>
              </button>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="social flex justify-center space-x-4" style={responsiveStyles}>
            {component.content.platforms.map((platform: any, index: number) => (
              <a
                key={index}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <ThumbsUp size={16} />
              </a>
            ))}
          </div>
        );

      case 'hero':
        return (
          <MediaDropZone
            onMediaDrop={(file, url) => {
              if (onAddToMediaLibrary) {
                onAddToMediaLibrary(file, url);
              }
              onUpdate({ content: { ...component.content, backgroundImage: url } });
            }}
            accept="image/*"
            className="w-full h-full"
          >
            <div
              className="hero-section"
              style={{
                ...responsiveStyles,
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${component.content.backgroundImage})`,
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <h1 className="text-4xl font-bold mb-4">{component.content.title}</h1>
              <p className="text-xl mb-8 max-w-2xl">{component.content.subtitle}</p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                {component.content.buttonText}
              </button>
            </div>
          </MediaDropZone>
        );
      
      case 'feature-grid':
        return (
          <div className="feature-grid" style={responsiveStyles}>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {component.content.features.map((feature: any, index: number) => (
                  <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'progress':
        return (
          <div className="progress" style={responsiveStyles}>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-blue-600 h-4 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
            </div>
          </div>
        );

      default:
        return <div>Composant non supporté</div>;
    }
  };

  const responsivePosition = getResponsivePosition();
  const responsiveSize = getResponsiveSize();

  return (
    <div
      className={`absolute group ${
        !isPreviewMode && !component.locked 
          ? isDragging ? 'cursor-grabbing' : isResizing ? 'cursor-nw-resize' : 'cursor-grab' 
          : 'cursor-pointer'
      } ${
        isSelected && !isPreviewMode ? 'ring-2 ring-blue-500' : ''
      } ${component.locked ? 'opacity-75' : ''}`}
      style={{
        left: responsivePosition.x,
        top: responsivePosition.y,
        zIndex: component.styles.zIndex || component.layer || 0,
        opacity: component.styles.opacity || 1,
        width: responsiveSize.width,
        height: responsiveSize.height,
        userSelect: isDragging ? 'none' : 'auto'
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      {renderComponent()}
      
      {/* Drag handle */}
      {isSelected && !isPreviewMode && !component.locked && (
        <div 
          className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-grab hover:cursor-grabbing opacity-75 hover:opacity-100 flex items-center justify-center"
          onMouseDown={handleMouseDown}
        >
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
      
      {/* Resize handles for images and videos */}
      {isSelected && !isPreviewMode && !component.locked && isResizable && (
        <>
          {/* Corner handles */}
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full opacity-75 hover:opacity-100"
            style={{ cursor: getResizeCursor('nw') }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-75 hover:opacity-100"
            style={{ cursor: getResizeCursor('ne') }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full opacity-75 hover:opacity-100"
            style={{ cursor: getResizeCursor('sw') }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-75 hover:opacity-100"
            style={{ cursor: getResizeCursor('se') }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
          
          {/* Side handles */}
          <div
            className="absolute top-1/2 -left-1 w-3 h-3 bg-blue-500 rounded-full opacity-75 hover:opacity-100 transform -translate-y-1/2"
            style={{ cursor: getResizeCursor('w') }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
          />
          <div
            className="absolute top-1/2 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-75 hover:opacity-100 transform -translate-y-1/2"
            style={{ cursor: getResizeCursor('e') }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
          />
          <div
            className="absolute -top-1 left-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-75 hover:opacity-100 transform -translate-x-1/2"
            style={{ cursor: getResizeCursor('n') }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
          />
          <div
            className="absolute -bottom-1 left-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-75 hover:opacity-100 transform -translate-x-1/2"
            style={{ cursor: getResizeCursor('s') }}
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
          />
        </>
      )}
      
      {/* Component label */}
      {isSelected && !isPreviewMode && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
          <span>{component.type}</span>
          {viewMode !== 'desktop' && (
            <span className="bg-white bg-opacity-20 px-1 rounded text-xs">
              {viewMode === 'tablet' ? 'T' : 'M'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DraggableComponent;