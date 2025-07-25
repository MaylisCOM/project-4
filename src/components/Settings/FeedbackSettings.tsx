import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Bug, 
  Lightbulb, 
  HelpCircle,
  Send,
  Star,
  TrendingUp
} from 'lucide-react';
import { FeedbackItem } from '../../types';

interface FeedbackSettingsProps {
  onSubmitFeedback: (feedback: Partial<FeedbackItem>) => void;
}

const FeedbackSettings: React.FC<FeedbackSettingsProps> = ({ onSubmitFeedback }) => {
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
    } catch (error) {
      console.error('Erreur lors de l\'envoi du feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug size={12} className="text-red-500" />;
      case 'feature': return <Lightbulb size={12} className="text-blue-500" />;
      case 'improvement': return <TrendingUp size={12} className="text-green-500" />;
      case 'question': return <HelpCircle size={12} className="text-purple-500" />;
      default: return <MessageSquare size={12} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-900/20 text-blue-300';
      case 'in-progress': return 'bg-yellow-900/20 text-yellow-300';
      case 'resolved': return 'bg-green-900/20 text-green-300';
      case 'closed': return 'bg-gray-700 text-gray-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Feedback récent */}
      <div>
        <h4 className="font-medium mb-2 text-sm">Feedback récent de la communauté</h4>
        <div className="space-y-2 max-h-24 overflow-y-auto">
          {recentFeedback.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {getTypeIcon(item.type)}
                <span className="text-xs truncate">{item.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <ThumbsUp size={10} />
                  <span>{item.votes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire de feedback */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-2">Type de feedback</label>
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setFeedbackType('bug')}
              className={`p-2 rounded-lg border text-xs flex items-center space-x-1 ${
                feedbackType === 'bug'
                  ? 'border-red-500 bg-red-900/20 text-red-300'
                  : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <Bug size={12} />
              <span>Bug</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedbackType('feature')}
              className={`p-2 rounded-lg border text-xs flex items-center space-x-1 ${
                feedbackType === 'feature'
                  ? 'border-blue-500 bg-blue-900/20 text-blue-300'
                  : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <Lightbulb size={12} />
              <span>Idée</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedbackType('improvement')}
              className={`p-2 rounded-lg border text-xs flex items-center space-x-1 ${
                feedbackType === 'improvement'
                  ? 'border-green-500 bg-green-900/20 text-green-300'
                  : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <TrendingUp size={12} />
              <span>Amélioration</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedbackType('question')}
              className={`p-2 rounded-lg border text-xs flex items-center space-x-1 ${
                feedbackType === 'question'
                  ? 'border-purple-500 bg-purple-900/20 text-purple-300'
                  : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <HelpCircle size={12} />
              <span>Question</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-xs"
            placeholder="Résumez votre feedback"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded h-16 resize-none text-white text-xs"
            placeholder="Décrivez votre feedback en détail..."
            required
          />
        </div>

        {/* Note de satisfaction */}
        <div>
          <label className="block text-xs font-medium mb-1">Satisfaction générale</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-500'
                } hover:text-yellow-500 transition-colors`}
              >
                <Star size={14} fill="currentColor" />
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !description.trim()}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-xs"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
          ) : (
            <>
              <Send size={12} />
              <span>Envoyer le feedback</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackSettings;