import React, { useState } from 'react';
import { 
  Bot, 
  Wand2, 
  Search, 
  Lightbulb, 
  Target, 
  Zap,
  MessageCircle,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { Component, Project, SEOSuggestions, Suggestion } from '../../types';

interface AIAssistantProps {
  project: Project;
  selectedComponent?: Component;
  onApplySuggestion: (suggestion: Suggestion) => void;
  onGenerateContent: (type: string, content: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  project,
  selectedComponent,
  onApplySuggestion,
  onGenerateContent
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessage, setChatMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      type: 'seo',
      title: 'Optimiser le titre principal',
      description: 'Votre titre pourrait être plus accrocheur et inclure des mots-clés pertinents',
      priority: 'high'
    },
    {
      type: 'accessibility',
      title: 'Ajouter des textes alternatifs',
      description: 'Certaines images manquent de descriptions pour les lecteurs d\'écran',
      priority: 'medium'
    },
    {
      type: 'performance',
      title: 'Optimiser les images',
      description: 'Compresser les images pour améliorer le temps de chargement',
      priority: 'medium'
    }
  ]);

  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider à améliorer votre site ?',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      type: 'user',
      message: chatMessage,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    setIsGenerating(true);

    // Simulation de réponse IA
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        message: generateAIResponse(chatMessage),
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 1500);
  };

  const generateAIResponse = (message: string): string => {
    const responses = [
      "Excellente question ! Pour améliorer votre SEO, je recommande d'ajouter des mots-clés pertinents dans vos titres et descriptions.",
      "Je peux vous aider à optimiser ce contenu. Voulez-vous que je génère une version améliorée ?",
      "Basé sur l'analyse de votre site, voici mes recommandations pour améliorer l'engagement utilisateur...",
      "Cette section pourrait bénéficier d'un meilleur contraste pour l'accessibilité. Voulez-vous que je propose des couleurs alternatives ?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleGenerateContent = async (type: string) => {
    setIsGenerating(true);
    
    // Simulation de génération de contenu
    setTimeout(() => {
      const generatedContent = {
        'title': 'Transformez votre vision en réalité digitale',
        'description': 'Découvrez notre plateforme innovante qui vous permet de créer des sites web professionnels sans aucune compétence technique. Avec notre éditeur intuitif et nos templates modernes, donnez vie à vos idées en quelques clics.',
        'button': 'Commencer maintenant'
      };
      
      onGenerateContent(type, generatedContent[type as keyof typeof generatedContent] || 'Contenu généré par IA');
      setIsGenerating(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'seo': return <Search size={16} />;
      case 'accessibility': return <Target size={16} />;
      case 'performance': return <Zap size={16} />;
      case 'design': return <Wand2 size={16} />;
      default: return <Lightbulb size={16} />;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
      >
        <Bot size={24} />
        <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Assistant IA
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot size={20} />
          <span className="font-semibold">Assistant IA</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/20 rounded"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'chat'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageCircle size={16} className="inline mr-1" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'suggestions'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lightbulb size={16} className="inline mr-1" />
          Suggestions
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'generate'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sparkles size={16} className="inline mr-1" />
          Générer
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Posez votre question..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || isGenerating}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="p-4 space-y-3 overflow-y-auto h-full">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getPriorityColor(suggestion.priority)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(suggestion.type)}
                    <span className="font-medium text-sm">{suggestion.title}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                    {suggestion.priority}
                  </span>
                </div>
                <p className="text-sm mb-3">{suggestion.description}</p>
                <button
                  onClick={() => onApplySuggestion(suggestion)}
                  className="text-xs bg-white px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Appliquer
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="p-4 space-y-4 overflow-y-auto h-full">
            <div className="space-y-3">
              <button
                onClick={() => handleGenerateContent('title')}
                disabled={isGenerating}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Wand2 size={16} className="text-purple-600" />
                  <span className="font-medium">Générer un titre</span>
                </div>
                <p className="text-sm text-gray-600">Créer un titre accrocheur et optimisé SEO</p>
              </button>

              <button
                onClick={() => handleGenerateContent('description')}
                disabled={isGenerating}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Wand2 size={16} className="text-blue-600" />
                  <span className="font-medium">Générer une description</span>
                </div>
                <p className="text-sm text-gray-600">Créer une description engageante</p>
              </button>

              <button
                onClick={() => handleGenerateContent('button')}
                disabled={isGenerating}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Wand2 size={16} className="text-green-600" />
                  <span className="font-medium">Générer un CTA</span>
                </div>
                <p className="text-sm text-gray-600">Créer un appel à l'action efficace</p>
              </button>
            </div>

            {isGenerating && (
              <div className="text-center py-4">
                <div className="inline-flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Génération en cours...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;