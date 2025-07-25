import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { componentCategories } from '../Editor/ComponentLibrary';

interface ComponentDropdownProps {
  onComponentSelect: (componentType: string) => void;
}

const ComponentDropdown: React.FC<ComponentDropdownProps> = ({ onComponentSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleComponentClick = (componentType: string) => {
    onComponentSelect(componentType);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          isOpen
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        {isOpen ? <X size={18} /> : <Plus size={18} />}
        <span>Composants</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
              Ajouter un composant
            </h3>
            
            {componentCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                  {category.name}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {category.components.map((component) => {
                    const Icon = component.icon;
                    return (
                      <button
                        key={component.type}
                        onClick={() => handleComponentClick(component.type)}
                        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left border border-gray-100 hover:border-gray-200"
                        title={component.description}
                      >
                        <Icon size={16} className="text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {component.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentDropdown;