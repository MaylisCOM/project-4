import React from 'react';
import { Template } from '../../types';
import { TrendingUp, Users, DollarSign, Award, Plus, Search, Filter } from 'lucide-react';

interface MarketplaceViewProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
}

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ templates, onTemplateSelect }) => {
  const [activeTab, setActiveTab] = React.useState('browse');
  
  const stats = [
    { label: 'Templates vendus', value: '12,345', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Créateurs actifs', value: '1,234', icon: Users, color: 'text-blue-600' },
    { label: 'Revenus générés', value: '€45,678', icon: DollarSign, color: 'text-purple-600' },
    { label: 'Templates premium', value: '567', icon: Award, color: 'text-yellow-600' },
  ];

  const tabs = [
    { id: 'browse', label: 'Parcourir' },
    { id: 'sell', label: 'Vendre' },
    { id: 'earnings', label: 'Revenus' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-gray-600 mb-6">Découvrez et vendez des templates de qualité professionnelle</p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'browse' && (
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher des templates..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={20} />
                <span>Filtres</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.filter(t => t.isPremium).map(template => (
                <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">{template.price}€</span>
                      <button
                        onClick={() => onTemplateSelect(template)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Acheter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sell' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Vendre votre template</h2>
              <p className="text-gray-600 mb-6">
                Partagez vos créations avec la communauté et générez des revenus
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom du template</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Mon super template"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg h-24"
                    placeholder="Décrivez votre template..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Catégorie</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg">
                      <option>Business</option>
                      <option>Portfolio</option>
                      <option>Landing Page</option>
                      <option>Blog</option>
                      <option>E-commerce</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Prix (€)</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="29"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Aperçu du template</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Plus className="mx-auto mb-2 text-gray-400" size={24} />
                    <p className="text-gray-600">Cliquez pour ajouter une image</p>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
                  Publier le template
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Revenus totaux</h3>
                <p className="text-3xl font-bold text-green-600">€1,234</p>
                <p className="text-sm text-gray-600">+12% ce mois</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Templates vendus</h3>
                <p className="text-3xl font-bold text-blue-600">42</p>
                <p className="text-sm text-gray-600">+5 cette semaine</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Taux de conversion</h3>
                <p className="text-3xl font-bold text-purple-600">8.5%</p>
                <p className="text-sm text-gray-600">+2.1% ce mois</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Historique des ventes</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg"></div>
                      <div>
                        <p className="font-medium">Template Business Pro</p>
                        <p className="text-sm text-gray-600">Vendu le {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">+€29</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceView;