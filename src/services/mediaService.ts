import { apiCall } from './api';
import { MediaItem } from '../types';

// Types pour les requêtes de médias
export interface MediaResponse {
  media: MediaItem[];
  total: number;
}

export interface MediaFilters {
  projectId?: string;
  type?: 'image' | 'video';
  folder?: string;
}

export interface UploadResponse {
  media: MediaItem;
  message: string;
}

// Service pour les médias
export class MediaService {
  // Récupérer tous les médias avec filtres
  static async getMedia(filters: MediaFilters = {}): Promise<MediaResponse> {
    try {
      const params = {
        projectId: filters.projectId,
        type: filters.type,
        folder: filters.folder
      };

      const response = await apiCall.get<MediaResponse>('/media', params);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la récupération des médias');
    }
  }

  // Upload d'un fichier média
  static async uploadMedia(file: File, projectId?: string, folder?: string): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (projectId) {
        formData.append('projectId', projectId);
      }
      
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await apiCall.upload<UploadResponse>('/media/upload', formData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de l\'upload du fichier');
    }
  }

  // Mettre à jour un média
  static async updateMedia(id: string, data: { name?: string; folder?: string }): Promise<{ media: MediaItem; message: string }> {
    try {
      const response = await apiCall.put<{ media: MediaItem; message: string }>(`/media/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la mise à jour du média');
    }
  }

  // Supprimer un média
  static async deleteMedia(id: string): Promise<{ message: string }> {
    try {
      const response = await apiCall.delete<{ message: string }>(`/media/${id}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la suppression du média');
    }
  }

  // Récupérer les médias d'un projet spécifique
  static async getProjectMedia(projectId: string): Promise<MediaResponse> {
    return this.getMedia({ projectId });
  }

  // Récupérer les images uniquement
  static async getImages(projectId?: string): Promise<MediaResponse> {
    return this.getMedia({ projectId, type: 'image' });
  }

  // Récupérer les vidéos uniquement
  static async getVideos(projectId?: string): Promise<MediaResponse> {
    return this.getMedia({ projectId, type: 'video' });
  }

  // Récupérer les médias d'un dossier spécifique
  static async getFolderMedia(folder: string, projectId?: string): Promise<MediaResponse> {
    return this.getMedia({ projectId, folder });
  }

  // Upload multiple de fichiers
  static async uploadMultipleMedia(
    files: File[], 
    projectId?: string, 
    folder?: string,
    onProgress?: (progress: number, fileName: string) => void
  ): Promise<UploadResponse[]> {
    const results: UploadResponse[] = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        if (onProgress) {
          onProgress((i / total) * 100, file.name);
        }

        const result = await this.uploadMedia(file, projectId, folder);
        results.push(result);

        if (onProgress) {
          onProgress(((i + 1) / total) * 100, file.name);
        }
      } catch (error) {
        console.error(`Erreur lors de l'upload de ${file.name}:`, error);
        // Continuer avec les autres fichiers même en cas d'erreur
      }
    }

    return results;
  }

  // Valider un fichier avant upload
  static validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/ogg'
    ];

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Le fichier est trop volumineux (max 10MB)'
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Type de fichier non supporté'
      };
    }

    return { isValid: true };
  }

  // Obtenir l'URL complète d'un média
  static getMediaUrl(media: MediaItem): string {
    if (media.url.startsWith('http')) {
      return media.url;
    }
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    return `${baseUrl}/media/files${media.url}`;
  }
}

export default MediaService;
