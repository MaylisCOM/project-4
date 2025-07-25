import React from 'react';
import { Type, Image, Video, Square, Layout, Layers, Minus, Star, ImageIcon, RotateCcw, List, Table as Tabs, TrendingUp, Clock, Mail, MapPin, Send, MessageSquare, ThumbsUp, Calendar, FileText, BarChart3, Zap, Eye, Mountain, MousePointer } from 'lucide-react';

interface ComponentLibraryProps {
  onComponentDrag?: (componentType: string) => void;
}

export const componentCategories = [
    {
      name: 'Éléments de base',
      components: [
        { type: 'header', label: 'Titre', icon: Type, description: 'Titre principal ou sous-titre' },
        { type: 'text', label: 'Texte', icon: Type, description: 'Paragraphe ou bloc de texte' },
        { type: 'image', label: 'Image', icon: Image, description: 'Image avec options de style' },
        { type: 'video', label: 'Vidéo', icon: Video, description: 'YouTube, Vimeo ou upload direct' },
        { type: 'buttons', label: 'Boutons', icon: Square, description: 'Groupe de boutons personnalisables' },
        { type: 'separator', label: 'Séparateur', icon: Minus, description: 'Ligne de séparation' },
        { type: 'icon', label: 'Icône', icon: Star, description: 'Icône ou pack d\'icônes' },
        { type: 'quote', label: 'Citation', icon: MessageSquare, description: 'Bloc de citation stylisé' },
      ]
    },
    {
      name: 'Médias & Galeries',
      components: [
        { type: 'gallery', label: 'Galerie', icon: ImageIcon, description: 'Galerie d\'images responsive' },
        { type: 'carousel', label: 'Carrousel', icon: RotateCcw, description: 'Slider d\'images ou contenu' },
      ]
    },
    {
      name: 'Interactifs',
      components: [
        { type: 'accordion', label: 'Accordéon', icon: List, description: 'FAQ ou contenu pliable' },
        { type: 'tabs', label: 'Onglets', icon: Tabs, description: 'Contenu organisé en onglets' },
        { type: 'counter', label: 'Compteur', icon: TrendingUp, description: 'Compteur animé' },
        { type: 'timeline', label: 'Timeline', icon: Clock, description: 'Chronologie d\'événements' },
        { type: 'progress', label: 'Progression', icon: BarChart3, description: 'Barre de progression' },
      ]
    },
    {
      name: 'Formulaires & Contact',
      components: [
        { type: 'form', label: 'Formulaire', icon: Mail, description: 'Formulaire de contact personnalisable' },
        { type: 'newsletter', label: 'Newsletter', icon: Send, description: 'Inscription newsletter' },
        { type: 'map', label: 'Carte', icon: MapPin, description: 'Google Maps intégrée' },
      ]
    },
    {
      name: 'Social & Contenu',
      components: [
        { type: 'social', label: 'Réseaux sociaux', icon: ThumbsUp, description: 'Liens et partage social' },
      ]
    },
    {
      name: 'Sections complexes',
      components: [
        { type: 'feature-grid', label: 'Grille Features', icon: Layers, description: 'Présentation de fonctionnalités' },
      ]
    }
  ];

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onComponentDrag }) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
          Composants
        </h3>
        
        {componentCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <h4 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
              {category.name}
            </h4>
            <div className="space-y-1">
              {category.components.map((component) => {
                const Icon = component.icon;
                return (
                  <div
                    key={component.type}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('component-type', component.type);
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    className="group flex items-start space-x-3 p-3 rounded-lg cursor-move hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-700"
                    title={component.description}
                  >
                    <Icon size={16} className="text-gray-400 group-hover:text-white mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-300 group-hover:text-white">
                        {component.label}
                      </p>
                      <p className="text-xs text-gray-500 group-hover:text-gray-300 mt-1 line-clamp-2">
                        {component.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentLibrary;