import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Home, 
  Eye,
  Settings,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Page } from '../../types';

interface PagesPanelProps {
  pages: Page[];
  currentPageId?: string;
  onPageChange?: (pageId: string) => void;
  onPageCreate?: (pageName: string) => void;
  onPageDelete?: (pageId: string) => void;
}

const PagesPanel: React.FC<PagesPanelProps> = ({
  pages,
  currentPageId,
  onPageChange,
  onPageCreate,
  onPageDelete
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreatePage = () => {
    if (newPageName.trim() && onPageCreate) {
      onPageCreate(newPageName.trim());
      setNewPageName('');
      setIsCreating(false);
    }
  };

  const handleEditPage = (page: Page) => {
    setEditingPageId(page.id);
    setEditingName(page.name);
  };

  const handleSaveEdit = () => {
    // TODO: Implement page rename functionality
    setEditingPageId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingPageId(null);
    setEditingName('');
  };

  const handleDeletePage = (pageId: string) => {
    if (pages.length > 1 && onPageDelete) {
      const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette page ?');
      if (confirmDelete) {
        onPageDelete(pageId);
      }
    }
  };

  const handleDuplicatePage = (page: Page) => {
    if (onPageCreate) {
      onPageCreate(`${page.name} (copie)`);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Pages du site
          </h3>
          <button
            onClick={() => setIsCreating(true)}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            title="Ajouter une page"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Formulaire de création */}
        {isCreating && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <input
              type="text"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder="Nom de la page"
              className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleCreatePage()}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleCreatePage}
                disabled={!newPageName.trim()}
                className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Créer
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewPageName('');
                }}
                className="flex-1 bg-gray-600 text-white py-1 px-2 rounded text-sm hover:bg-gray-700"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste des pages */}
        <div className="space-y-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                currentPageId === page.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => onPageChange && onPageChange(page.id)}
            >
              <div className="flex items-center space-x-2">
                {page.isHomePage ? (
                  <Home size={16} className="flex-shrink-0" />
                ) : (
                  <FileText size={16} className="flex-shrink-0" />
                )}
                
                {editingPageId === page.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    onBlur={handleSaveEdit}
                    autoFocus
                  />
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{page.name}</p>
                    <p className="text-xs opacity-75">/{page.slug}</p>
                  </div>
                )}
              </div>

              {/* Actions (visibles au survol) */}
              {editingPageId !== page.id && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPage(page);
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                      title="Renommer"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicatePage(page);
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                      title="Dupliquer"
                    >
                      <Copy size={12} />
                    </button>
                    {!page.isHomePage && pages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePage(page.id);
                        }}
                        className="p-1 hover:bg-red-600 rounded"
                        title="Supprimer"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Informations sur la page actuelle */}
        {currentPageId && (
          <div className="mt-6 p-3 bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-2 text-sm">Page actuelle</h4>
            {(() => {
              const currentPage = pages.find(p => p.id === currentPageId);
              if (!currentPage) return null;
              
              return (
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Composants:</span>
                    <span>{currentPage.components?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modifiée:</span>
                    <span>{currentPage.updatedAt.toLocaleDateString()}</span>
                  </div>
                  {currentPage.seoSettings?.title && (
                    <div>
                      <span>Titre SEO:</span>
                      <p className="text-gray-300 mt-1 truncate">
                        {currentPage.seoSettings.title}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Actions rapides */}
        <div className="mt-4 space-y-2">
          <button className="w-full flex items-center space-x-2 p-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm">
            <Eye size={14} />
            <span>Prévisualiser le site</span>
          </button>
          <button className="w-full flex items-center space-x-2 p-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm">
            <Settings size={14} />
            <span>Paramètres du site</span>
          </button>
          <button className="w-full flex items-center space-x-2 p-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm">
            <ExternalLink size={14} />
            <span>Voir le site publié</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PagesPanel;