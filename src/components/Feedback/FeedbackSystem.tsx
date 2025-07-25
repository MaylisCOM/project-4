import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Bug, 
  Lightbulb, 
  HelpCircle,
  Send,
  X,
  Star,
  TrendingUp
} from 'lucide-react';
import { FeedbackItem } from '../../types';

interface FeedbackSystemProps {
  onSubmitFeedback: (feedback: Partial<FeedbackItem>) => void;
}

const FeedbackSystem: React.FC<FeedbackSystemProps> = ({ onSubmitFeedback }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'improvement' | 'question'>('feature');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [recentFeedback] = useState<FeedbackItem[]>([
    {
      id: '1',
      userId: 'user1',
      type: 'feature',
      title: 'Ajouter un mode sombre',
      description: 'Il serait génial d\'avoir un thème sombre pour travailler le soir',
      status: 'in-progress',
      priority: 'medium',
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-15'),
      votes: 23
    },
    {
      id: '2',
      userId: 'user2',
      type: 'bug',
      title: 'Problème de sauvegarde',
      description: 'Parfois les modifications ne se sauvegardent pas automatiquement',
      status: 'resolved',
      priority: 'high',
      createdAt: new Date('2025-01-12'),
      updatedAt: new Date('2025-01-16'),
      votes: 15
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    const feedback: Partial<FeedbackItem> = {
      type: feedbackType,
      title: title.trim(),
      description: description.trim(),
      status: 'open',
      priority: feedbackType === 'bug' ? 'high' : 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      votes: 0
    };

    try {
      await onSubmitFeedback(feedback);
      
      // Reset form
      setTitle('');
      setDescription('');
      setRating(0);
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug size={16} className="text-red-500" />;
      case 'feature': return <Lightbulb size={16} className="text-blue-500" />;
      case 'improvement': return <TrendingUp size={16} className="text-green-500" />;
      case 'question': return <HelpCircle size={16} className="text-purple-500" />;
      default: return <MessageSquare size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
      >
        <MessageSquare size={24} />
        <div className="absolute -top-12 left-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Feedback
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageSquare size={20} />
          <span className="font-semibold">Votre avis compte</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/20 rounded"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-4">
        {/* Feedback récent */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Feedback récent de la communauté</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentFeedback.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {getTypeIcon(item.type)}
                  <span className="text-sm truncate">{item.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <ThumbsUp size={12} />
                    <span>{item.votes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire de feedback */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type de feedback</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFeedbackType('bug')}
                className={`p-2 rounded-lg border text-sm flex items-center space-x-2 ${
                  feedbackType === 'bug'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Bug size={16} />
                <span>Bug</span>
              </button>
              <button
                type="button"
                onClick={() => setFeedbackType('feature')}
                className={`p-2 rounded-lg border text-sm flex items-center space-x-2 ${
                  feedbackType === 'feature'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Lightbulb size={16} />
                <span>Idée</span>
              </button>
              <button
                type="button"
                onClick={() => setFeedbackType('improvement')}
                className={`p-2 rounded-lg border text-sm flex items-center space-x-2 ${
                  feedbackType === 'improvement'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <TrendingUp size={16} />
                <span>Amélioration</span>
              </button>
              <button
                type="button"
                onClick={() => setFeedbackType('question')}
                className={`p-2 rounded-lg border text-sm flex items-center space-x-2 ${
                  feedbackType === 'question'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <HelpCircle size={16} />
                <span>Question</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Résumez votre feedback en quelques mots"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Décrivez votre feedback en détail..."
              required
            />
          </div>

          {/* Note de satisfaction */}
          <div>
            <label className="block text-sm font-medium mb-2">Satisfaction générale</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
                  } hover:text-yellow-500 transition-colors`}
                >
                  <Star size={20} fill="currentColor" />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Send size={16} />
                <span>Envoyer le feedback</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackSystem;