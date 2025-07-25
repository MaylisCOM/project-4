import React, { useState } from 'react';
import TemplatePage from '../Pages/TemplatePage';
import { modernBusinessTemplate } from '../../data/templates/modernBusinessTemplate';
import { creativePortfolioTemplate } from '../../data/templates/creativePortfolioTemplate';
import { Component } from '../../types';

/**
 * Composant de démonstration pour montrer comment utiliser les templates éditables
 * 
 * Ce composant montre comment:
 * - Charger un template depuis les données
 * - Permettre l'édition de tous les textes et images
 * - Gérer les mises à jour des composants
 */
const TemplateDemo: React.FC = () => {
  // État pour stocker les composants du template
  const [components, setComponents] = useState<Component[]>(modernBusinessTemplate);
  const [selectedComponentId, setSelectedComponentId] = useState<string | undefined>();
  const [currentTemplate, setCurrentTemplate] = useState<'modern' | 'creative'>('modern');

  // Fonction pour mettre à jour un composant
  const handleComponentUpdate = (componentId: string, updates: Partial<Component>) => {
    setComponents(prevComponents => 
      prevComponents.map(comp => 
        comp.id === componentId 
          ? { ...comp, ...updates } 
          : comp
      )
    );
  };

  // Fonction pour sélectionner un composant
  const handleComponentSelect = (componentId: string) => {
    setSelectedComponentId(componentId);
  };

  // Fonction pour changer de template
  const handleTemplateChange = (template: 'modern' | 'creative') => {
    setCurrentTemplate(template);
    setComponents(template === 'modern' ? modernBusinessTemplate : creativePortfolioTemplate);
    setSelectedComponentId(undefined);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Barre de contrôle pour la démo */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Démonstration des Templates Éditables</h1>
        <div className="flex gap-4">
          <button
            onClick={() => handleTemplateChange('modern')}
            className={`px-4 py-2 rounded ${
              currentTemplate === 'modern' 
                ? 'bg-blue-600' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            Template Business Moderne
          </button>
          <button
            onClick={() => handleTemplateChange('creative')}
            className={`px-4 py-2 rounded ${
              currentTemplate === 'creative' 
                ? 'bg-blue-600' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            Template Portfolio Créatif
          </button>
        </div>
      </div>

      {/* Zone d'information */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Astuce:</strong> Tous les éléments de ce template sont éditables ! 
          Cliquez sur n'importe quel texte, image ou composant pour le modifier. 
          Les modifications sont appliquées en temps réel.
        </p>
      </div>

      {/* Affichage du template */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <TemplatePage
          components={components}
          isPreviewMode={false}
          viewMode="desktop"
          onComponentUpdate={handleComponentUpdate}
          onComponentSelect={handleComponentSelect}
          selectedComponentId={selectedComponentId}
        />
      </div>

      {/* Panneau d'information sur le composant sélectionné */}
      {selectedComponentId && (
        <div className="bg-white border-t border-gray-200 p-4">
          <h3 className="font-semibold mb-2">Composant sélectionné</h3>
          <p className="text-sm text-gray-600">
            ID: {selectedComponentId}
          </p>
          <p className="text-sm text-gray-600">
            Type: {components.find(c => c.id === selectedComponentId)?.type}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Utilisez le panneau de propriétés dans l'éditeur principal pour modifier ce composant.
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateDemo;

/**
 * COMMENT UTILISER LES TEMPLATES ÉDITABLES:
 * 
 * 1. Importez les données du template:
 *    import { modernBusinessTemplate } from '../../data/templates/modernBusinessTemplate';
 * 
 * 2. Utilisez le composant TemplatePage:
 *    <TemplatePage
 *      components={modernBusinessTemplate}
 *      isPreviewMode={false}  // false pour permettre l'édition
 *      onComponentUpdate={handleComponentUpdate}
 *      onComponentSelect={handleComponentSelect}
 *    />
 * 
 * 3. Gérez les mises à jour des composants:
 *    - Textes: modifiables via content.text
 *    - Images: remplaçables via content.src
 *    - Styles: personnalisables via styles object
 * 
 * 4. Intégration avec l'éditeur:
 *    - Le TemplateLibrary charge automatiquement les templates
 *    - Les composants sont ajoutés au Canvas
 *    - Le PropertyPanel permet de modifier tous les attributs
 * 
 * AVANTAGES:
 * - Tous les éléments sont des composants réutilisables
 * - Édition en temps réel de tous les contenus
 * - Possibilité d'ajouter/supprimer des composants
 * - Support du drag & drop pour réorganiser
 * - Responsive design intégré
 */
