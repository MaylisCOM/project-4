import React from 'react';
import { Move, Lock, Unlock, Eye, EyeOff, Copy, Trash2 } from 'lucide-react';
import { Component } from '../../types';
import DraggableComponent from './DraggableComponent';

interface CanvasProps {
  components: Component[];
  onComponentUpdate: (id: string, updates: Partial<Component>) => void;
  onComponentSelect: (id: string) => void;
  onComponentAdd: (component: Component) => void;
  onComponentDelete: (id: string) => void;
  onComponentDuplicate: (id: string) => void;
  onComponentLock: (id: string, locked: boolean) => void;
  onComponentVisibility: (id: string, visible: boolean) => void;
  selectedComponentId?: string;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  isPreviewMode: boolean;
  showGrid?: boolean;
  snapToGrid?: boolean;
  mediaLibrary?: MediaItem[];
  onAddToMediaLibrary?: (file: File, url: string) => MediaItem;
}

const Canvas: React.FC<CanvasProps> = ({
  components,
  onComponentUpdate,
  onComponentSelect,
  onComponentAdd,
  onComponentDelete,
  onComponentDuplicate,
  onComponentLock,
  onComponentVisibility,
  selectedComponentId,
  viewMode,
  isPreviewMode,
  showGrid = false,
  snapToGrid = true,
  mediaLibrary,
  onAddToMediaLibrary
}) => {
  const canvasWidths = {
    desktop: 'w-full max-w-none',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('component-type');
    
    if (componentType) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newComponent: Component = {
        id: `${componentType}-${Date.now()}`,
        type: componentType as any,
        content: getDefaultContent(componentType),
        styles: getDefaultStyles(componentType),
        position: { 
          x: snapToGrid ? Math.round(x / 20) * 20 : x, 
          y: snapToGrid ? Math.round(y / 20) * 20 : y 
        },
        size: getDefaultSize(componentType),
        locked: false,
        visible: true,
        layer: components.length
      };

      onComponentAdd(newComponent);
    }
  };

  const getDefaultSize = (type: string) => {
    switch (type) {
      case 'image':
        return { width: '300px', height: '200px' };
      case 'video':
        return { width: '400px', height: '225px' };
      default:
        return { width: '100%', height: 'auto' };
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleComponentAction = (action: string, componentId: string) => {
    switch (action) {
      case 'delete':
        onComponentDelete(componentId);
        break;
      case 'duplicate':
        onComponentDuplicate(componentId);
        break;
      case 'lock':
        const component = components.find(c => c.id === componentId);
        onComponentLock(componentId, !component?.locked);
        break;
      case 'visibility':
        const comp = components.find(c => c.id === componentId);
        onComponentVisibility(componentId, !comp?.visible);
        break;
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Désélectionner si on clique sur le canvas vide
    if (e.target === e.currentTarget) {
      onComponentSelect('');
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="flex justify-center p-8">
        <div 
          className={`bg-white shadow-lg transition-all duration-300 min-h-screen relative ${canvasWidths[viewMode]} ${
            viewMode !== 'desktop' ? 'mx-auto' : ''
          } ${showGrid ? 'bg-grid' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleCanvasClick}
          style={{ minHeight: '800px' }}
        >
          {/* Grid overlay */}
          {showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
          )}
          
          {components.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">Commencez votre création</h3>
                <p className="text-sm">
                  Glissez-déposez des composants depuis la barre latérale pour commencer
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {components
                .filter(component => component.visible !== false)
                .sort((a, b) => (a.layer || 0) - (b.layer || 0))
                .map((component) => (
                <DraggableComponent
                  key={component.id}
                  component={component}
                  isSelected={selectedComponentId === component.id}
                  onUpdate={(updates) => onComponentUpdate(component.id, updates)}
                  onSelect={() => onComponentSelect(component.id)}
                  isPreviewMode={isPreviewMode}
                  viewMode={viewMode}
                  snapToGrid={snapToGrid}
                  mediaLibrary={mediaLibrary}
                  onAddToMediaLibrary={onAddToMediaLibrary}
                />
              ))}
              
              {/* Component toolbar */}
              {selectedComponentId && !isPreviewMode && (
                <ComponentToolbar
                  componentId={selectedComponentId}
                  component={components.find(c => c.id === selectedComponentId)}
                  onAction={handleComponentAction}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ComponentToolbar: React.FC<{
  componentId: string;
  component?: Component;
  onAction: (action: string, componentId: string) => void;
}> = ({ componentId, component, onAction }) => {
  if (!component) return null;

  return (
    <div 
      className="absolute bg-blue-600 text-white px-2 py-1 rounded-lg shadow-lg flex items-center space-x-1 text-xs z-50"
      style={{
        left: component.position.x,
        top: component.position.y - 35,
        transform: 'translateX(-50%)'
      }}
    >
      <button
        onClick={() => onAction('lock', componentId)}
        className="p-1 hover:bg-blue-700 rounded"
        title={component.locked ? 'Déverrouiller' : 'Verrouiller'}
      >
        {component.locked ? <Unlock size={12} /> : <Lock size={12} />}
      </button>
      <button
        onClick={() => onAction('visibility', componentId)}
        className="p-1 hover:bg-blue-700 rounded"
        title={component.visible !== false ? 'Masquer' : 'Afficher'}
      >
        {component.visible !== false ? <Eye size={12} /> : <EyeOff size={12} />}
      </button>
      <button
        onClick={() => onAction('duplicate', componentId)}
        className="p-1 hover:bg-blue-700 rounded"
        title="Dupliquer"
      >
        <Copy size={12} />
      </button>
      <button
        onClick={() => onAction('delete', componentId)}
        className="p-1 hover:bg-red-600 rounded"
        title="Supprimer"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
};

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
    case 'hero':
      return { 
        title: 'Votre message principal',
        subtitle: 'Une description accrocheuse de votre offre',
        buttonText: 'Commencer',
        backgroundImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920'
      };
    case 'feature-grid':
      return {
        features: [
          { title: 'Fonctionnalité 1', description: 'Description de la fonctionnalité', icon: '⚡' },
          { title: 'Fonctionnalité 2', description: 'Description de la fonctionnalité', icon: '🚀' },
          { title: 'Fonctionnalité 3', description: 'Description de la fonctionnalité', icon: '💎' },
        ]
      };
    case 'video':
      return { 
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
        type: 'youtube',
        autoplay: false,
        controls: true
      };
    case 'separator':
      return { style: 'solid', thickness: 1 };
    case 'icon':
      return { name: 'star', size: 24, color: '#3b82f6' };
    case 'quote':
      return { 
        text: 'Une citation inspirante qui marque les esprits',
        author: 'Auteur de la citation',
        company: 'Entreprise'
      };
    case 'gallery':
      return {
        images: [
          { src: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Image 1' },
          { src: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Image 2' },
          { src: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400', alt: 'Image 3' }
        ],
        layout: 'grid',
        columns: 3
      };
    case 'carousel':
      return {
        slides: [
          { image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Slide 1', description: 'Description du slide 1' },
          { image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Slide 2', description: 'Description du slide 2' }
        ],
        autoplay: true,
        interval: 5000
      };
    case 'accordion':
      return {
        items: [
          { title: 'Question 1', content: 'Réponse à la première question' },
          { title: 'Question 2', content: 'Réponse à la deuxième question' },
          { title: 'Question 3', content: 'Réponse à la troisième question' }
        ]
      };
    case 'tabs':
      return {
        tabs: [
          { title: 'Onglet 1', content: 'Contenu du premier onglet' },
          { title: 'Onglet 2', content: 'Contenu du deuxième onglet' },
          { title: 'Onglet 3', content: 'Contenu du troisième onglet' }
        ]
      };
    case 'counter':
      return { 
        value: 1000, 
        label: 'Clients satisfaits',
        duration: 2000,
        prefix: '',
        suffix: '+'
      };
    case 'timeline':
      return {
        events: [
          { date: '2020', title: 'Création de l\'entreprise', description: 'Début de notre aventure' },
          { date: '2021', title: 'Premier succès', description: 'Lancement de notre premier produit' },
          { date: '2022', title: 'Expansion', description: 'Ouverture de nouveaux marchés' },
          { date: '2023', title: 'Innovation', description: 'Développement de nouvelles technologies' }
        ]
      };
    case 'form':
      return {
        fields: [
          { type: 'text', name: 'name', label: 'Nom', required: true, placeholder: 'Votre nom' },
          { type: 'email', name: 'email', label: 'Email', required: true, placeholder: 'votre@email.com' },
          { type: 'textarea', name: 'message', label: 'Message', required: true, placeholder: 'Votre message...' }
        ],
        submitText: 'Envoyer',
        action: '/contact',
        method: 'POST'
      };
    case 'map':
      return {
        address: 'Paris, France',
        zoom: 12,
        marker: true
      };
    case 'newsletter':
      return {
        title: 'Restez informé',
        description: 'Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités',
        placeholder: 'Votre adresse email',
        buttonText: 'S\'inscrire'
      };
    case 'social':
      return {
        platforms: [
          { name: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
          { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
          { name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
          { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' }
        ]
      };
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
    case 'image':
      return {
        borderRadius: '8px',
        maxWidth: '100%',
        height: 'auto'
      };
    case 'video':
      return {
        borderRadius: '8px'
      };
    case 'hero':
      return {
        padding: '4rem 2rem',
        textAlign: 'center' as const,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white'
      };
    case 'feature-grid':
      return {
        padding: '3rem 2rem'
      };
    default:
      return {};
  }
};

export default Canvas;