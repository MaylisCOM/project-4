import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Settings,
  Palette,
  Eye,
  Zap,
  Search,
  FileText,
  MessageSquare,
  Globe
} from 'lucide-react';
import ComponentLibrary from '../Editor/ComponentLibrary';
import PagesPanel from '../Pages/PagesPanel';
import LanguageSettings from '../Settings/LanguageSettings';
import FeedbackSettings from '../Settings/FeedbackSettings';
import TemplateLibrary from '../Templates/TemplateLibrary';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activePanel?: string;
  onPanelChange: (panel: string) => void;
  onPageChange?: (pageId: string) => void;
  onPageCreate?: (pageName: string) => void;
  onPageDelete?: (pageId: string) => void;
  pages?: any[];
  currentPageId?: string;
  onLanguageChange?: (language: string) => void;
  onAddLanguage?: (language: string) => void;
  onRemoveLanguage?: (language: string) => void;
  currentLanguage?: string;
  availableLanguages?: string[];
  onSubmitFeedback?: (feedback: any) => void;
  onTemplateSelect?: (template: any) => void;
  currentProject?: any;
  onUpdateProject?: (updates: any) => void;
  onAddToMediaLibrary?: (file: File, url: string) => any;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activePanel = 'templates',
  onPanelChange,
  onPageChange,
  onPageCreate,
  onPageDelete,
  pages = [],
  currentPageId,
  onLanguageChange,
  onAddLanguage,
  onRemoveLanguage,
  currentLanguage = 'fr',
  availableLanguages = ['fr'],
  onSubmitFeedback,
  currentProject,
  onUpdateProject,
  onAddToMediaLibrary,
  onTemplateSelect
}) => {
  const sidebarPanels = [
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'components', label: 'Composants', icon: Layers },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'accessibility', label: 'Accessibilité', icon: Eye },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const handlePanelClick = (panelId: string) => {
    onPanelChange(panelId);
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 60 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-gray-900 text-white h-full flex flex-col border-r border-gray-700 relative z-10"
    >
      {/* Header avec bouton de collapse */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-semibold"
            >
              Éditeur
            </motion.h2>
          )}
        </AnimatePresence>
        
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title={isCollapsed ? 'Développer' : 'Réduire'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation des panneaux */}
      {!isCollapsed && (
        <div className="flex-shrink-0 border-b border-gray-700">
          <div className="p-2 space-y-1">
            {sidebarPanels.map((panel) => {
              const Icon = panel.icon;
              const isActive = activePanel === panel.id;
              
              return (
                <button
                  key={panel.id}
                  onClick={() => handlePanelClick(panel.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{panel.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Contenu du panneau actif */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activePanel === 'templates' && onTemplateSelect && (
                <TemplateLibrary onTemplateSelect={onTemplateSelect} />
              )}
              
              {activePanel === 'components' && (
                <ComponentLibrary />
              )}
              
              {activePanel === 'pages' && (
                <PagesPanel
                  pages={pages}
                  currentPageId={currentPageId}
                  onPageChange={onPageChange}
                  onPageCreate={onPageCreate}
                  onPageDelete={onPageDelete}
                />
              )}
              
              {activePanel === 'design' && (
                <div className="p-4 h-full overflow-y-auto">
                  <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
                    Design & Identité
                  </h3>
                  <div className="space-y-3 pb-4">
                    {/* Logo de l'entreprise */}
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center space-x-2">
                        <span>Logo de l'entreprise</span>
                      </h4>
                      <div className="space-y-2">
                        {currentProject?.branding?.logo ? (
                          <div className="relative">
                            <img
                              src={currentProject.branding.logo}
                              alt="Logo"
                              className="w-full h-16 object-contain bg-white rounded border"
                            />
                            <button
                              onClick={() => {
                                if (onUpdateProject) {
                                  onUpdateProject({
                                    branding: {
                                      ...currentProject.branding,
                                      logo: undefined
                                    }
                                  });
                                }
                              }}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                            <div className="text-gray-400 mb-2">
                              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">Glissez votre logo ici</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && onAddToMediaLibrary && onUpdateProject) {
                              const url = URL.createObjectURL(file);
                              onAddToMediaLibrary(file, url);
                              onUpdateProject({
                                branding: {
                                  ...currentProject?.branding,
                                  logo: url
                                }
                              });
                            }
                          }}
                          className="w-full text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        <p className="text-xs text-gray-500">Format recommandé: PNG, SVG (max 2MB)</p>
                      </div>
                    </div>

                    {/* Favicon */}
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">Favicon</h4>
                      <div className="space-y-2">
                        {currentProject?.branding?.favicon ? (
                          <div className="relative">
                            <img
                              src={currentProject.branding.favicon}
                              alt="Favicon"
                              className="w-8 h-8 object-contain bg-white rounded border"
                            />
                            <button
                              onClick={() => {
                                if (onUpdateProject) {
                                  onUpdateProject({
                                    branding: {
                                      ...currentProject.branding,
                                      favicon: undefined
                                    }
                                  });
                                }
                              }}
                              className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-600 rounded-lg p-2 text-center">
                            <div className="text-gray-400 mb-1">
                              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-xs text-gray-400">Favicon</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && onAddToMediaLibrary && onUpdateProject) {
                              const url = URL.createObjectURL(file);
                              onAddToMediaLibrary(file, url);
                              onUpdateProject({
                                branding: {
                                  ...currentProject?.branding,
                                  favicon: url
                                }
                              });
                            }
                          }}
                          className="w-full text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        <p className="text-xs text-gray-500">Format: ICO, PNG 16x16 ou 32x32px</p>
                      </div>
                    </div>

                    {/* Nom de l'entreprise */}
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">Nom de l'entreprise</h4>
                      <input
                        type="text"
                        value={currentProject?.branding?.companyName || ''}
                        onChange={(e) => {
                          if (onUpdateProject) {
                            onUpdateProject({
                              branding: {
                                ...currentProject?.branding,
                                companyName: e.target.value
                              }
                            });
                          }
                        }}
                        placeholder="Nom de votre entreprise"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">Affiché à côté du logo</p>
                    </div>

                    <div className="p-3 bg-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">Thème global</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="w-full h-8 bg-blue-500 rounded cursor-pointer"></div>
                        <div className="w-full h-8 bg-green-500 rounded cursor-pointer"></div>
                        <div className="w-full h-8 bg-purple-500 rounded cursor-pointer"></div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">Typographie</h4>
                      <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white">
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Open Sans</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              {activePanel === 'accessibility' && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
                    Accessibilité
                  </h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-gray-300">
                      Outils d'accessibilité et vérifications automatiques.
                    </p>
                  </div>
                </div>
              )}
              
              {activePanel === 'performance' && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
                    Performance
                  </h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-gray-300">
                      Optimisations et métriques de performance.
                    </p>
                  </div>
                </div>
              )}
              
              {activePanel === 'settings' && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
                    Paramètres
                  </h3>
                  <div className="space-y-3">
                   {/* Gestion des langues */}
                   <div className="p-3 bg-gray-800 rounded-lg">
                     <h4 className="font-medium mb-3 flex items-center space-x-2">
                       <Globe size={16} />
                       <span>Langues</span>
                     </h4>
                     <LanguageSettings
                       currentLanguage={currentLanguage}
                       availableLanguages={availableLanguages}
                       onLanguageChange={onLanguageChange || (() => {})}
                       onAddLanguage={onAddLanguage || (() => {})}
                       onRemoveLanguage={onRemoveLanguage || (() => {})}
                     />
                   </div>
                   
                   {/* Feedback */}
                   <div className="p-3 bg-gray-800 rounded-lg">
                     <h4 className="font-medium mb-3 flex items-center space-x-2">
                       <MessageSquare size={16} />
                       <span>Feedback</span>
                     </h4>
                     {onSubmitFeedback && (
                       <FeedbackSettings onSubmitFeedback={onSubmitFeedback} />
                     )}
                   </div>
                   
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">Grille</h4>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Afficher la grille</span>
                      </label>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">Magnétisme</h4>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Aligner sur la grille</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Version réduite - icônes seulement */}
        {isCollapsed && (
          <div className="p-2 space-y-2">
            {sidebarPanels.map((panel) => {
              const Icon = panel.icon;
              const isActive = activePanel === panel.id;
              
              return (
                <button
                  key={panel.id}
                  onClick={() => {
                    onPanelChange(panel.id);
                    onToggleCollapse(); // Développer automatiquement
                  }}
                  className={`w-full p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  title={panel.label}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;