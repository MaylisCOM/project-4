import React, { useState } from 'react';
import { 
  Globe, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X,
  Languages,
  Flag
} from 'lucide-react';
import { Project } from '../../types';

interface LanguageManagerProps {
  project: Project;
  onLanguageChange: (language: string) => void;
  onAddLanguage: (language: string) => void;
  onRemoveLanguage: (language: string) => void;
  onTranslateContent: (targetLanguage: string) => void;
}

const LanguageManager: React.FC<LanguageManagerProps> = ({
  project,
  onLanguageChange,
  onAddLanguage,
  onRemoveLanguage,
  onTranslateContent
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');

  const availableLanguages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const projectLanguages = project.languages || ['fr'];
  const currentLanguage = project.currentLanguage || 'fr';

  const getCurrentLanguageInfo = () => {
    return availableLanguages.find(lang => lang.code === currentLanguage) || availableLanguages[0];
  };

  const handleAddLanguage = () => {
    if (newLanguage && !projectLanguages.includes(newLanguage)) {
      onAddLanguage(newLanguage);
      setNewLanguage('');
      setIsAddingLanguage(false);
    }
  };

  const handleTranslate = (targetLanguage: string) => {
    onTranslateContent(targetLanguage);
  };

  if (!isOpen) {
    return (
      <div className="fixed top-20 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getCurrentLanguageInfo().flag}</span>
            <Globe size={20} className="text-blue-600" />
          </div>
          <div className="absolute -bottom-8 right-0 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Langues ({projectLanguages.length})
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-6 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Languages size={20} className="text-blue-600" />
          <span className="font-semibold">Gestion des langues</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-4">
        {/* Langue actuelle */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Langue actuelle</h4>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-2xl">{getCurrentLanguageInfo().flag}</span>
            <div>
              <p className="font-medium text-blue-900">{getCurrentLanguageInfo().name}</p>
              <p className="text-sm text-blue-700">Langue principale</p>
            </div>
          </div>
        </div>

        {/* Langues du projet */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Langues disponibles</h4>
            <button
              onClick={() => setIsAddingLanguage(true)}
              className="text-sm bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>Ajouter</span>
            </button>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {projectLanguages.map((langCode) => {
              const langInfo = availableLanguages.find(lang => lang.code === langCode);
              if (!langInfo) return null;
              
              return (
                <div
                  key={langCode}
                  className={`flex items-center justify-between p-2 rounded-lg border ${
                    langCode === currentLanguage
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{langInfo.flag}</span>
                    <div>
                      <p className="font-medium text-sm">{langInfo.name}</p>
                      <p className="text-xs text-gray-500">{langInfo.code.toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {langCode === currentLanguage && (
                      <Check size={16} className="text-blue-600" />
                    )}
                    <button
                      onClick={() => onLanguageChange(langCode)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                    >
                      Activer
                    </button>
                    {projectLanguages.length > 1 && langCode !== 'fr' && (
                      <button
                        onClick={() => onRemoveLanguage(langCode)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ajouter une langue */}
        {isAddingLanguage && (
          <div className="mb-4 p-3 border border-gray-200 rounded-lg">
            <h4 className="font-medium mb-2">Ajouter une langue</h4>
            <div className="space-y-2">
              <select
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="">Sélectionner une langue</option>
                {availableLanguages
                  .filter(lang => !projectLanguages.includes(lang.code))
                  .map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddLanguage}
                  disabled={!newLanguage}
                  className="flex-1 bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => {
                    setIsAddingLanguage(false);
                    setNewLanguage('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Traduction automatique */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Traduction automatique</h4>
          <p className="text-xs text-gray-600 mb-3">
            Traduire automatiquement le contenu vers les autres langues
          </p>
          <div className="space-y-2">
            {projectLanguages
              .filter(lang => lang !== currentLanguage)
              .map(langCode => {
                const langInfo = availableLanguages.find(lang => lang.code === langCode);
                if (!langInfo) return null;
                
                return (
                  <button
                    key={langCode}
                    onClick={() => handleTranslate(langCode)}
                    className="w-full flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50 text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{langInfo.flag}</span>
                      <span>Traduire vers {langInfo.name}</span>
                    </div>
                    <Edit3 size={14} className="text-blue-600" />
                  </button>
                );
              })}
          </div>
        </div>

        {/* Statistiques */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium mb-2">Statistiques</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="font-bold text-blue-600">{projectLanguages.length}</p>
              <p className="text-gray-600">Langues</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="font-bold text-green-600">100%</p>
              <p className="text-gray-600">Traduit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageManager;