import React from 'react';
import { Component } from '../../types';
import { modernBusinessTemplate } from '../../data/templates/modernBusinessTemplate';
import { creativePortfolioTemplate } from '../../data/templates/creativePortfolioTemplate';

interface TemplateLibraryProps {
  onTemplateSelect?: (templateId: string, components?: Component[]) => void;
}

interface TemplatePreview {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  pagePath: string;
  components: Component[];
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onTemplateSelect }) => {
  const templates: TemplatePreview[] = [
    {
      id: 'modern-business',
      name: 'Business Moderne',
      description: 'Site complet moderne avec animations pour entreprise',
      thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
      pagePath: '/templates/modern-business',
      components: modernBusinessTemplate
    },
    {
      id: 'creative-portfolio',
      name: 'Portfolio Créatif',
      description: 'Portfolio complet animé pour créatifs et artistes',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      pagePath: '/templates/creative-portfolio',
      components: creativePortfolioTemplate
    }
  ];

  const handleTemplateClick = (template: TemplatePreview) => {
    if (onTemplateSelect) {
      // Pass the components array to load them in the editor
      onTemplateSelect(template.id, template.components);
    }
    console.log(`Template sélectionné: ${template.name} - Chargement de ${template.components.length} composants`);
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
        Templates
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors duration-200"
            onClick={() => handleTemplateClick(template)}
          >
            <div className="aspect-video bg-gray-700 relative overflow-hidden">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <h4 className="text-white font-medium text-sm mb-1">{template.name}</h4>
                <p className="text-gray-300 text-xs line-clamp-2">{template.description}</p>
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Template complet
                </span>
                <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors">
                  Voir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-400 text-center">
          💡 Cliquez sur un template pour voir la page complète
        </p>
      </div>
    </div>
  );
};

export default TemplateLibrary;
