import { apiCall } from './api';
import { Project, Page, Component } from '../types';

// Types pour les requêtes de projets
export interface CreateProjectRequest {
  name: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoLanguage?: string;
  seoRobots?: string;
  languages?: string[];
  currentLanguage?: string;
  logo?: string;
  favicon?: string;
  companyName?: string;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  id: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
}

export interface CreatePageRequest {
  name: string;
  slug: string;
  isHomePage?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface CreateComponentRequest {
  type: string;
  content: Record<string, unknown>;
  styles: Record<string, unknown>;
  positionX: number;
  positionY: number;
  width: string;
  height: string;
  responsivePosition?: Record<string, unknown>;
  responsiveSize?: Record<string, unknown>;
  locked?: boolean;
  visible?: boolean;
  layer?: number;
  seoAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  ariaLabel?: string;
  role?: string;
  tabIndex?: number;
  pageId?: string;
}

// Service pour les projets
export class ProjectService {
  // Récupérer tous les projets de l'utilisateur
  static async getProjects(): Promise<ProjectsResponse> {
    try {
      const response = await apiCall.get<ProjectsResponse>('/projects');
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la récupération des projets');
    }
  }

  // Récupérer un projet spécifique
  static async getProject(id: string): Promise<Project> {
    try {
      const response = await apiCall.get<Project>(`/projects/${id}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la récupération du projet');
    }
  }

  // Créer un nouveau projet
  static async createProject(projectData: CreateProjectRequest): Promise<{ project: Project; message: string }> {
    try {
      const response = await apiCall.post<{ project: Project; message: string }>('/projects', projectData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la création du projet');
    }
  }

  // Mettre à jour un projet
  static async updateProject(id: string, projectData: Partial<CreateProjectRequest>): Promise<{ project: Project; message: string }> {
    try {
      const response = await apiCall.put<{ project: Project; message: string }>(`/projects/${id}`, projectData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la mise à jour du projet');
    }
  }

  // Supprimer un projet
  static async deleteProject(id: string): Promise<{ message: string }> {
    try {
      const response = await apiCall.delete<{ message: string }>(`/projects/${id}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la suppression du projet');
    }
  }

  // Publier un projet
  static async publishProject(id: string): Promise<{ project: Project; message: string }> {
    try {
      const response = await apiCall.post<{ project: Project; message: string }>(`/projects/${id}/publish`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la publication du projet');
    }
  }

  // Créer une nouvelle page
  static async createPage(projectId: string, pageData: CreatePageRequest): Promise<{ page: Page; message: string }> {
    try {
      const response = await apiCall.post<{ page: Page; message: string }>(`/projects/${projectId}/pages`, pageData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la création de la page');
    }
  }

  // Mettre à jour une page
  static async updatePage(projectId: string, pageId: string, pageData: Partial<CreatePageRequest>): Promise<{ page: Page; message: string }> {
    try {
      const response = await apiCall.put<{ page: Page; message: string }>(`/projects/${projectId}/pages/${pageId}`, pageData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la mise à jour de la page');
    }
  }

  // Supprimer une page
  static async deletePage(projectId: string, pageId: string): Promise<{ message: string }> {
    try {
      const response = await apiCall.delete<{ message: string }>(`/projects/${projectId}/pages/${pageId}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la suppression de la page');
    }
  }

  // Créer un nouveau composant
  static async createComponent(projectId: string, componentData: CreateComponentRequest): Promise<{ component: Component; message: string }> {
    try {
      const response = await apiCall.post<{ component: Component; message: string }>(`/projects/${projectId}/components`, componentData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la création du composant');
    }
  }

  // Mettre à jour un composant
  static async updateComponent(projectId: string, componentId: string, componentData: Partial<CreateComponentRequest>): Promise<{ component: Component; message: string }> {
    try {
      const response = await apiCall.put<{ component: Component; message: string }>(`/projects/${projectId}/components/${componentId}`, componentData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la mise à jour du composant');
    }
  }

  // Supprimer un composant
  static async deleteComponent(projectId: string, componentId: string): Promise<{ message: string }> {
    try {
      const response = await apiCall.delete<{ message: string }>(`/projects/${projectId}/components/${componentId}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la suppression du composant');
    }
  }

  // Sauvegarder l'état complet d'un projet (utilisé pour la sauvegarde automatique)
  static async saveProjectState(projectId: string, projectData: {
    components: Component[];
    pages: Page[];
    currentPageId: string;
  }): Promise<{ message: string }> {
    try {
      const response = await apiCall.put<{ message: string }>(`/projects/${projectId}/state`, projectData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la sauvegarde du projet');
    }
  }
}

export default ProjectService;
