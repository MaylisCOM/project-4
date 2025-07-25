import { apiCall } from './api';
import { FeedbackItem, FeedbackResponse } from '../types';

// Types pour les requêtes de feedback
export interface FeedbacksResponse {
  feedbacks: FeedbackItem[];
  total: number;
  hasMore: boolean;
}

export interface FeedbackFilters {
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
  type?: 'bug' | 'feature' | 'improvement' | 'question';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateFeedbackRequest {
  type: 'bug' | 'feature' | 'improvement' | 'question';
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface UpdateFeedbackRequest {
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface CreateResponseRequest {
  message: string;
  isOfficial?: boolean;
}

// Service pour les feedbacks
export class FeedbackService {
  // Récupérer tous les feedbacks avec filtres
  static async getFeedbacks(filters: FeedbackFilters = {}): Promise<FeedbacksResponse> {
    try {
      const params = {
        status: filters.status,
        type: filters.type,
        priority: filters.priority,
        userId: filters.userId,
        limit: filters.limit || 20,
        offset: filters.offset || 0,
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc'
      };

      const response = await apiCall.get<FeedbacksResponse>('/feedback', params);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la récupération des feedbacks');
    }
  }

  // Récupérer un feedback spécifique
  static async getFeedback(id: string): Promise<FeedbackItem> {
    try {
      const response = await apiCall.get<FeedbackItem>(`/feedback/${id}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la récupération du feedback');
    }
  }

  // Créer un nouveau feedback
  static async createFeedback(feedbackData: CreateFeedbackRequest): Promise<{ feedback: FeedbackItem; message: string }> {
    try {
      const response = await apiCall.post<{ feedback: FeedbackItem; message: string }>('/feedback', feedbackData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la création du feedback');
    }
  }

  // Mettre à jour un feedback
  static async updateFeedback(id: string, feedbackData: UpdateFeedbackRequest): Promise<{ feedback: FeedbackItem; message: string }> {
    try {
      const response = await apiCall.put<{ feedback: FeedbackItem; message: string }>(`/feedback/${id}`, feedbackData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la mise à jour du feedback');
    }
  }

  // Supprimer un feedback
  static async deleteFeedback(id: string): Promise<{ message: string }> {
    try {
      const response = await apiCall.delete<{ message: string }>(`/feedback/${id}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la suppression du feedback');
    }
  }

  // Voter pour un feedback
  static async voteFeedback(id: string, direction: 'up' | 'down'): Promise<{ message: string; votes: number }> {
    try {
      const response = await apiCall.post<{ message: string; votes: number }>(`/feedback/${id}/vote`, { direction });
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors du vote');
    }
  }

  // Ajouter une réponse à un feedback
  static async addResponse(feedbackId: string, responseData: CreateResponseRequest): Promise<{ response: FeedbackResponse; message: string }> {
    try {
      const response = await apiCall.post<{ response: FeedbackResponse; message: string }>(`/feedback/${feedbackId}/responses`, responseData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de l\'ajout de la réponse');
    }
  }

  // Récupérer les feedbacks par statut
  static async getFeedbacksByStatus(status: 'open' | 'in-progress' | 'resolved' | 'closed', limit = 20, offset = 0): Promise<FeedbacksResponse> {
    return this.getFeedbacks({ status, limit, offset });
  }

  // Récupérer les feedbacks par type
  static async getFeedbacksByType(type: 'bug' | 'feature' | 'improvement' | 'question', limit = 20, offset = 0): Promise<FeedbacksResponse> {
    return this.getFeedbacks({ type, limit, offset });
  }

  // Récupérer les feedbacks par priorité
  static async getFeedbacksByPriority(priority: 'low' | 'medium' | 'high' | 'critical', limit = 20, offset = 0): Promise<FeedbacksResponse> {
    return this.getFeedbacks({ priority, limit, offset });
  }

  // Récupérer les feedbacks de l'utilisateur connecté
  static async getMyFeedbacks(limit = 20, offset = 0): Promise<FeedbacksResponse> {
    // L'userId sera automatiquement déterminé côté serveur via le token
    return this.getFeedbacks({ limit, offset });
  }

  // Récupérer les feedbacks populaires (les plus votés)
  static async getPopularFeedbacks(limit = 10): Promise<FeedbacksResponse> {
    return this.getFeedbacks({ 
      limit, 
      offset: 0, 
      sortBy: 'votes', 
      sortOrder: 'desc' 
    });
  }

  // Récupérer les feedbacks récents
  static async getRecentFeedbacks(limit = 10): Promise<FeedbacksResponse> {
    return this.getFeedbacks({ 
      limit, 
      offset: 0, 
      sortBy: 'createdAt', 
      sortOrder: 'desc' 
    });
  }

  // Rechercher dans les feedbacks
  static async searchFeedbacks(query: string, filters: Omit<FeedbackFilters, 'search'> = {}): Promise<FeedbacksResponse> {
    // Note: La recherche devrait être implémentée côté serveur
    // Pour l'instant, on utilise les filtres existants
    return this.getFeedbacks(filters);
  }

  // Obtenir les statistiques des feedbacks
  static async getFeedbackStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    try {
      // Cette route devrait être ajoutée côté serveur
      const response = await apiCall.get<{
        total: number;
        byStatus: Record<string, number>;
        byType: Record<string, number>;
        byPriority: Record<string, number>;
      }>('/feedback/stats');
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la récupération des statistiques');
    }
  }
}

export default FeedbackService;
