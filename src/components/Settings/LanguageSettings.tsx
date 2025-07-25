import React, { useState } from 'react';
import { Globe, Plus, Trash2, Check } from 'lucide-react';

interface LanguageSettingsProps {
  currentLanguage: string;
  availableLanguages: string[];
  onLanguageChange: (language: string) => void;
  onAddLanguage: (language: string) => void;
  onRemoveLanguage: (language: string) => void;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  currentLanguage,
  availableLanguages,
  onLanguageChange,
  onAddLanguage,
  onRemoveLanguage
}) => {
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');

  const allLanguages = [
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

  const getCurrentLanguageInfo = () => {
    return allLanguages.find(lang => lang.code === currentLanguage) || allLanguages[0];
  };

  const handleAddLanguage = () => {
    if (newLanguage && !availableLanguages.includes(newLanguage)) {
      onAddLanguage(newLanguage);
      setNewLanguage('');
      setIsAddingLanguage(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Langue actuelle */}
      <div>
        <h4 className="font-medium mb-2 text-sm">Langue actuelle</h4>
        <div className="flex items-center space-x-3 p-2 bg-blue-900/20 rounded-lg border border-blue-700/30">
          <span className="text-lg">{getCurrentLanguageInfo().flag}</span>
          <div className="flex-1">
            <p className="font-medium text-sm text-blue-300">{getCurrentLanguageInfo().name}</p>
            <p className="text-xs text-blue-400">Langue principale</p>
          </div>
        </div>
      </div>

      {/* Langues disponibles */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">Langues du site</h4>
          <button
            onClick={() => setIsAddingLanguage(true)}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
          >
            <Plus size={12} />
            <span>Ajouter</span>
          </button>
        </div>
        
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {availableLanguages.map((langCode) => {
            const langInfo = allLanguages.find(lang => lang.code === langCode);
            if (!langInfo) return null;
            
            return (
              <div
                key={langCode}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  langCode === currentLanguage
                    ? 'bg-blue-900/30 border border-blue-700/50'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{langInfo.flag}</span>
                  <div>
                    <p className="font-medium text-xs">{langInfo.name}</p>
                    <p className="text-xs text-gray-400">{langInfo.code.toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {langCode === currentLanguage && (
                    <Check size={12} className="text-blue-400" />
                  )}
                  <button
                    onClick={() => onLanguageChange(langCode)}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                  >
                    {langCode === currentLanguage ? 'Actuelle' : 'Activer'}
                  </button>
                  {availableLanguages.length > 1 && langCode !== 'fr' && (
                    <button
                      onClick={() => onRemoveLanguage(langCode)}
                      className="text-red-400 hover:bg-red-900/20 p-1 rounded"
                    >
                      <Trash2 size={10} />
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
        <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="font-medium mb-2 text-sm">Ajouter une langue</h4>
          <div className="space-y-2">
            <select
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-white"
            >
              <option value="">Sélectionner une langue</option>
              {allLanguages
                .filter(lang => !availableLanguages.includes(lang.code))
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
                className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Ajouter
              </button>
              <button
                onClick={() => {
                  setIsAddingLanguage(false);
                  setNewLanguage('');
                }}
                className="flex-1 bg-gray-600 text-white py-1 px-2 rounded text-sm hover:bg-gray-700"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="border-t border-gray-700 pt-3">
        <h4 className="font-medium mb-2 text-sm">Statistiques</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-800 rounded">
            <p className="font-bold text-blue-400">{availableLanguages.length}</p>
            <p className="text-gray-400">Langues</p>
          </div>
          <div className="text-center p-2 bg-gray-800 rounded">
            <p className="font-bold text-green-400">100%</p>
            <p className="text-gray-400">Traduit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;