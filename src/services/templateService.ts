import { apiCall } from './api';
import { Template } from '../types';

// Types pour les requêtes de templates
export interface TemplatesResponse {
  templates: Template[];
  total: number;
  hasMore: boolean;
}

export interface TemplateFilters {
  category?: string;
  isPremium?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CategoryResponse {
  categories: {
    name: string;
    count: number;
    label: string;
  }[];
}

// Service pour les templates
export class TemplateService {
  // Récupérer tous les templates avec filtres
  static async getTemplates(filters: TemplateFilters = {}): Promise<TemplatesResponse> {
    try {
      const params = {
        category: filters.category,
        isPremium: filters.isPremium,
        search: filters.search,
        limit: filters.limit || 20,
        offset: filters.offset || 0
      };

      const response = await apiCall.get<TemplatesResponse>('/templates', params);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la récupération des templates');
    }
  }

  // Récupérer un template spécifique
  static async getTemplate(id: string): Promise<Template> {
    try {
      const response = await apiCall.get<Template>(`/templates/${id}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la récupération du template');
    }
  }

  // Récupérer les catégories disponibles
  static async getCategories(): Promise<CategoryResponse> {
    try {
      const response = await apiCall.get<CategoryResponse>('/templates/meta/categories');
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la récupération des catégories');
    }
  }

  // Enregistrer un téléchargement de template
  static async downloadTemplate(id: string): Promise<{ message: string }> {
    try {
      const response = await apiCall.post<{ message: string }>(`/templates/${id}/download`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de l\'enregistrement du téléchargement');
    }
  }

  // Rechercher des templates
  static async searchTemplates(query: string, filters: Omit<TemplateFilters, 'search'> = {}): Promise<TemplatesResponse> {
    return this.getTemplates({ ...filters, search: query });
  }

  // Récupérer les templates populaires
  static async getPopularTemplates(limit = 10): Promise<TemplatesResponse> {
    return this.getTemplates({ limit, offset: 0 });
  }

  // Récupérer les templates par catégorie
  static async getTemplatesByCategory(category: string, limit = 20, offset = 0): Promise<TemplatesResponse> {
    return this.getTemplates({ category, limit, offset });
  }

  // Récupérer les templates premium
  static async getPremiumTemplates(limit = 20, offset = 0): Promise<TemplatesResponse> {
    return this.getTemplates({ isPremium: true, limit, offset });
  }

  // Récupérer les templates gratuits
  static async getFreeTemplates(limit = 20, offset = 0): Promise<TemplatesResponse> {
    return this.getTemplates({ isPremium: false, limit, offset });
  }
}

export default TemplateService;
