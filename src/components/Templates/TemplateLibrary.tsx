import React from 'react';
import { Template } from '../../types';
import { Star, Download, Crown, Eye } from 'lucide-react';

interface TemplateLibraryProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
  onTemplatePreview: (template: Template) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  templates,
  onTemplateSelect,
  onTemplatePreview
}) => {
  const categories = ['all', 'business', 'portfolio', 'landing', 'blog', 'ecommerce'];
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full bg-white">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Bibliothèque de Templates</h2>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un template..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'Tous' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                {template.isPremium && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                    <Crown size={12} />
                    <span className="text-xs font-medium">Premium</span>
                  </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    onClick={() => onTemplatePreview(template)}
                    className="bg-white text-gray-800 px-3 py-2 rounded-lg flex items-center space-x-1 text-sm hover:bg-gray-100"
                  >
                    <Eye size={16} />
                    <span>Aperçu</span>
                  </button>
                  <button
                    onClick={() => onTemplateSelect(template)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Utiliser
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  {template.isPremium && template.price && (
                    <span className="text-green-600 font-bold">{template.price}€</span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{template.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Par {template.author}</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-500" />
                      <span>{template.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download size={14} />
                      <span>{template.downloads}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;