import { apiCall, ApiResponse } from './api';
import { AuthUser, AuthState } from '../types';

// Types pour les requêtes d'authentification
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  message: string;
}

// Service d'authentification
export class AuthService {
  // Connexion utilisateur
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiCall.post<AuthResponse>('/auth/login', credentials);
      
      // Sauvegarder le token et les données utilisateur
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur de connexion');
    }
  }

  // Inscription utilisateur
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiCall.post<AuthResponse>('/auth/register', userData);
      
      // Sauvegarder le token et les données utilisateur
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur d\'inscription');
    }
  }

  // Vérification du token
  static async verifyToken(): Promise<{ user: AuthUser; message: string }> {
    try {
      const response = await apiCall.get<{ user: AuthUser; message: string }>('/auth/verify');
      
      // Mettre à jour les données utilisateur
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      // Token invalide ou expiré
      this.logout();
      throw new Error(error.response?.data?.error || 'Token invalide');
    }
  }

  // Déconnexion
  static async logout(): Promise<void> {
    try {
      await apiCall.post('/auth/logout');
    } catch (error) {
      // Ignorer les erreurs de déconnexion côté serveur
      console.warn('Erreur lors de la déconnexion côté serveur:', error);
    } finally {
      // Nettoyer le stockage local
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  // Récupérer l'utilisateur depuis le localStorage
  static getCurrentUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  // Vérifier si l'utilisateur est connecté
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Récupérer le token
  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Initialiser l'état d'authentification
  static getInitialAuthState(): AuthState {
    const user = this.getCurrentUser();
    const isAuthenticated = this.isAuthenticated();

    return {
      user,
      isAuthenticated,
      isLoading: false
    };
  }

  // Vérifier et rafraîchir l'authentification au démarrage
  static async initializeAuth(): Promise<AuthState> {
    const token = this.getToken();
    
    if (!token) {
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    }

    try {
      const { user } = await this.verifyToken();
      return {
        user,
        isAuthenticated: true,
        isLoading: false
      };
    } catch (error) {
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    }
  }
}

export default AuthService;
