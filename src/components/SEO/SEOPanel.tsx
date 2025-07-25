import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Globe,
  Eye,
  Clock,
  Smartphone,
  MapPin,
  FileText,
  Settings as SettingsIcon
} from 'lucide-react';
import { Project, SEOSuggestions, Page } from '../../types';

interface SEOPanelProps {
  project: Project;
  pages: Page[];
  currentPageId?: string;
  onUpdateSEO: (seoSettings: any) => void;
  onUpdatePageSEO: (pageId: string, seoSettings: any) => void;
}

const SEOPanel: React.FC<SEOPanelProps> = ({ 
  project, 
  pages, 
  currentPageId, 
  onUpdateSEO, 
  onUpdatePageSEO 
}) => {
  const [activeTab, setActiveTab] = useState('page');
  const [selectedPageId, setSelectedPageId] = useState(currentPageId || pages[0]?.id);
  
  const currentPage = pages.find(p => p.id === selectedPageId);
  
  const [pageSeoData, setPageSeoData] = useState({
    title: currentPage?.seoSettings?.title || '',
    description: currentPage?.seoSettings?.description || '',
    keywords: currentPage?.seoSettings?.keywords?.join(', ') || '',
    cities: currentPage?.seoSettings?.cities?.join(', ') || '',
    customMeta: currentPage?.seoSettings?.customMeta || {}
  });

  const [globalSeoData, setGlobalSeoData] = useState({
    title: project.seoSettings?.title || '',
    description: project.seoSettings?.description || '',
    keywords: project.seoSettings?.keywords?.join(', ') || '',
    cities: project.seoSettings?.cities?.join(', ') || '',
    language: project.seoSettings?.language || 'fr',
    robots: project.seoSettings?.robots || 'index, follow',
    globalMeta: project.seoSettings?.globalMeta || {}
  });

  const [seoScore] = useState(78);
  const [suggestions] = useState<SEOSuggestions>({
    title: 'Optimisez votre titre avec des mots-clés pertinents',
    description: 'Votre meta description pourrait être plus engageante',
    keywords: ['création site web', 'éditeur visuel', 'templates professionnels'],
    improvements: [
      'Ajouter des mots-clés dans le titre principal',
      'Optimiser les balises alt des images',
      'Améliorer la structure des titres H1-H6',
      'Ajouter des liens internes pertinents',
      'Inclure des villes pour le référencement local'
    ],
    score: seoScore
  });

  // Mettre à jour les données quand la page change
  useEffect(() => {
    if (currentPage) {
      setPageSeoData({
        title: currentPage.seoSettings?.title || '',
        description: currentPage.seoSettings?.description || '',
        keywords: currentPage.seoSettings?.keywords?.join(', ') || '',
        cities: currentPage.seoSettings?.cities?.join(', ') || '',
        customMeta: currentPage.seoSettings?.customMeta || {}
      });
    }
  }, [currentPage]);

  const handlePageInputChange = (field: string, value: string) => {
    const newData = { ...pageSeoData, [field]: value };
    setPageSeoData(newData);
    
    const keywords = field === 'keywords' ? value.split(',').map(k => k.trim()).filter(k => k) : pageSeoData.keywords.split(',').map(k => k.trim()).filter(k => k);
    const cities = field === 'cities' ? value.split(',').map(c => c.trim()).filter(c => c) : pageSeoData.cities.split(',').map(c => c.trim()).filter(c => c);
    
    onUpdatePageSEO(selectedPageId, {
      ...newData,
      keywords,
      cities
    });
  };

  const handleGlobalInputChange = (field: string, value: string) => {
    const newData = { ...globalSeoData, [field]: value };
    setGlobalSeoData(newData);
    
    const keywords = field === 'keywords' ? value.split(',').map(k => k.trim()).filter(k => k) : globalSeoData.keywords.split(',').map(k => k.trim()).filter(k => k);
    const cities = field === 'cities' ? value.split(',').map(c => c.trim()).filter(c => c) : globalSeoData.cities.split(',').map(c => c.trim()).filter(c => c);
    
    onUpdateSEO({
      ...newData,
      keywords,
      cities
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        <h3 className="font-semibold text-lg flex items-center space-x-2">
          <Search size={20} className="text-blue-600" />
          <span>Optimisation SEO</span>
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('page')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'page'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText size={14} className="inline mr-1" />
          Page
        </button>
        <button
          onClick={() => setActiveTab('global')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'global'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <SettingsIcon size={14} className="inline mr-1" />
          Global
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp size={14} className="inline mr-1" />
          Analyse
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'page' && (
          <div className="space-y-4">
            {/* Sélecteur de page */}
            <div>
              <label className="block text-sm font-medium mb-2">Page à optimiser</label>
              <select
                value={selectedPageId}
                onChange={(e) => setSelectedPageId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {pages.map(page => (
                  <option key={page.id} value={page.id}>
                    {page.name} {page.isHomePage ? '(Accueil)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Titre SEO de la page */}
            <div>
              <label className="block text-sm font-medium mb-2">Titre SEO de la page</label>
              <input
                type="text"
                value={pageSeoData.title}
                onChange={(e) => handlePageInputChange('title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Titre optimisé pour cette page"
              />
              <div className="flex justify-between text-xs mt-1">
                <span className={pageSeoData.title.length > 60 ? 'text-red-500' : 'text-gray-500'}>
                  {pageSeoData.title.length}/60 caractères
                </span>
                <span className="text-gray-400">Optimal: 50-60 caractères</span>
              </div>
            </div>

            {/* Description SEO de la page */}
            <div>
              <label className="block text-sm font-medium mb-2">Meta description de la page</label>
              <textarea
                value={pageSeoData.description}
                onChange={(e) => handlePageInputChange('description', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-20 resize-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description engageante pour cette page spécifique"
              />
              <div className="flex justify-between text-xs mt-1">
                <span className={pageSeoData.description.length > 160 ? 'text-red-500' : 'text-gray-500'}>
                  {pageSeoData.description.length}/160 caractères
                </span>
                <span className="text-gray-400">Optimal: 150-160 caractères</span>
              </div>
            </div>

            {/* Mots-clés de la page */}
            <div>
              <label className="block text-sm font-medium mb-2">Mots-clés de la page</label>
              <input
                type="text"
                value={pageSeoData.keywords}
                onChange={(e) => handlePageInputChange('keywords', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="mot-clé1, mot-clé2, mot-clé3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Séparez les mots-clés par des virgules. Focus sur 3-5 mots-clés principaux.
              </p>
            </div>

            {/* Villes pour référencement local */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center space-x-1">
                <MapPin size={14} />
                <span>Villes ciblées (SEO local)</span>
              </label>
              <input
                type="text"
                value={pageSeoData.cities}
                onChange={(e) => handlePageInputChange('cities', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Paris, Lyon, Marseille, Toulouse"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ajoutez les villes où vous souhaitez être visible. Séparez par des virgules.
              </p>
            </div>

            {/* URL générée */}
            <div>
              <label className="block text-sm font-medium mb-2">URL de la page</label>
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                <span className="text-gray-500">https://votre-site.com/</span>
                <span className="font-medium">{currentPage?.slug || generateSlug(pageSeoData.title)}</span>
              </div>
            </div>

            {/* Aperçu Google pour cette page */}
            <div className="border border-gray-200 rounded-lg p-3">
              <h4 className="font-medium mb-2 text-sm">Aperçu Google - {currentPage?.name}</h4>
              <div className="space-y-1">
                <div className="text-blue-600 text-sm hover:underline cursor-pointer">
                  {pageSeoData.title || currentPage?.name || 'Titre de votre page'}
                </div>
                <div className="text-green-600 text-xs">
                  https://votre-site.com/{currentPage?.slug || generateSlug(pageSeoData.title)}
                </div>
                <div className="text-gray-600 text-xs">
                  {pageSeoData.description || 'Description de cette page qui apparaîtra dans les résultats de recherche Google.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'global' && (
          <div className="space-y-4">
            {/* Paramètres globaux du site */}
            <div>
              <h4 className="font-medium mb-3">Paramètres SEO globaux</h4>
              <p className="text-xs text-gray-600 mb-4">
                Ces paramètres s'appliquent à tout le site et servent de base pour toutes les pages.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Titre du site</label>
              <input
                type="text"
                value={globalSeoData.title}
                onChange={(e) => handleGlobalInputChange('title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de votre site ou entreprise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description du site</label>
              <textarea
                value={globalSeoData.description}
                onChange={(e) => handleGlobalInputChange('description', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-20 resize-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description générale de votre site"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mots-clés principaux</label>
              <input
                type="text"
                value={globalSeoData.keywords}
                onChange={(e) => handleGlobalInputChange('keywords', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="mots-clés généraux de votre activité"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center space-x-1">
                <MapPin size={14} />
                <span>Zones géographiques principales</span>
              </label>
              <input
                type="text"
                value={globalSeoData.cities}
                onChange={(e) => handleGlobalInputChange('cities', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Vos principales zones d'activité"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Langue</label>
              <select
                value={globalSeoData.language}
                onChange={(e) => handleGlobalInputChange('language', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Robots</label>
              <select
                value={globalSeoData.robots}
                onChange={(e) => handleGlobalInputChange('robots', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="index, follow">Index, Follow (Recommandé)</option>
                <option value="noindex, follow">No Index, Follow</option>
                <option value="index, nofollow">Index, No Follow</option>
                <option value="noindex, nofollow">No Index, No Follow</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Score SEO */}
            <div className={`p-4 rounded-lg ${getScoreBackground(seoScore)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Score SEO global</span>
                <span className={`text-2xl font-bold ${getScoreColor(seoScore)}`}>
                  {seoScore}/100
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    seoScore >= 80 ? 'bg-green-500' : seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${seoScore}%` }}
                />
              </div>
            </div>

            {/* Métriques par page */}
            <div>
              <h4 className="font-medium mb-3">SEO par page</h4>
              <div className="space-y-2">
                {pages.map(page => (
                  <div key={page.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{page.name}</p>
                      <p className="text-xs text-gray-600">
                        {page.seoSettings?.title ? '✓ Titre' : '✗ Titre'} | 
                        {page.seoSettings?.description ? ' ✓ Description' : ' ✗ Description'} | 
                        {page.seoSettings?.keywords?.length ? ' ✓ Mots-clés' : ' ✗ Mots-clés'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPageId(page.id);
                        setActiveTab('page');
                      }}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Optimiser
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions d'amélioration */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <TrendingUp size={16} />
                <span>Améliorations suggérées</span>
              </h4>
              <div className="space-y-2">
                {suggestions.improvements?.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded-lg">
                    <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-yellow-800">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mots-clés suggérés */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <Target size={16} />
                <span>Mots-clés suggérés</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.keywords?.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full cursor-pointer hover:bg-blue-200"
                    onClick={() => {
                      // Ajouter le mot-clé à la page actuelle
                      const currentKeywords = pageSeoData.keywords;
                      const newKeywords = currentKeywords ? `${currentKeywords}, ${keyword}` : keyword;
                      handlePageInputChange('keywords', newKeywords);
                    }}
                  >
                    + {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOPanel;