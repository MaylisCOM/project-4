import { apiCall } from './api';
import { AccessibilityReport, AccessibilityIssue } from '../types';

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  autoFix?: boolean;
  realTimeAnalysis?: boolean;
}

export interface ComponentAccessibilityAnalysis {
  componentId: string;
  componentType: string;
  score: number;
  issues: AccessibilityIssue[];
}

export interface AccessibilityAuditResponse {
  report: AccessibilityReport;
  projectId: string;
  analyzedAt: string;
  componentCount: number;
}

export interface ComponentAnalysisResponse {
  analysis: ComponentAccessibilityAnalysis;
  componentId: string;
  analyzedAt: string;
}

export interface FixIssuesResponse {
  message: string;
  fixedIssues: Array<{
    issue: AccessibilityIssue;
    componentId: string;
    fixes: Record<string, unknown>;
  }>;
  projectId: string;
}

export interface AccessibilitySettingsResponse {
  settings: AccessibilitySettings;
  projectId: string;
}

// Service pour l'accessibilité
export class AccessibilityService {
  
  /**
   * Analyser l'accessibilité d'un projet complet
   */
  static async analyzeProject(projectId: string): Promise<AccessibilityAuditResponse> {
    try {
      const response = await apiCall.get<AccessibilityAuditResponse>(
        `/accessibility/${projectId}/audit`
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de l\'analyse d\'accessibilité');
    }
  }

  /**
   * Analyser l'accessibilité d'un composant spécifique
   */
  static async analyzeComponent(projectId: string, componentId: string): Promise<ComponentAnalysisResponse> {
    try {
      const response = await apiCall.get<ComponentAnalysisResponse>(
        `/accessibility/${projectId}/component/${componentId}`
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de l\'analyse du composant');
    }
  }

  /**
   * Appliquer des corrections automatiques
   */
  static async fixIssues(projectId: string, issues: AccessibilityIssue[]): Promise<FixIssuesResponse> {
    try {
      const response = await apiCall.post<FixIssuesResponse>(
        `/accessibility/${projectId}/fix`,
        { issues }
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la correction automatique');
    }
  }

  /**
   * Récupérer les paramètres d'accessibilité
   */
  static async getSettings(projectId: string): Promise<AccessibilitySettingsResponse> {
    try {
      const response = await apiCall.get<AccessibilitySettingsResponse>(
        `/accessibility/${projectId}/settings`
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la récupération des paramètres');
    }
  }

  /**
   * Mettre à jour les paramètres d'accessibilité
   */
  static async updateSettings(projectId: string, settings: AccessibilitySettings): Promise<AccessibilitySettingsResponse> {
    try {
      const response = await apiCall.put<AccessibilitySettingsResponse>(
        `/accessibility/${projectId}/settings`,
        { settings }
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la mise à jour des paramètres');
    }
  }

  /**
   * Appliquer les paramètres d'accessibilité à l'interface
   */
  static applyAccessibilitySettings(settings: AccessibilitySettings): void {
    const body = document.body;
    
    // Contraste élevé
    if (settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
    
    // Texte large
    if (settings.largeText) {
      body.classList.add('large-text');
    } else {
      body.classList.remove('large-text');
    }
    
    // Réduction des animations
    if (settings.reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }
    
    // Support lecteur d'écran
    if (settings.screenReader) {
      body.setAttribute('aria-live', 'polite');
    } else {
      body.removeAttribute('aria-live');
    }
  }

  /**
   * Tester la navigation au clavier
   */
  static testKeyboardNavigation(): Promise<{ success: boolean; issues: string[] }> {
    return new Promise((resolve) => {
      const issues: string[] = [];
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) {
        issues.push('Aucun élément focusable trouvé');
      }

      // Vérifier que tous les éléments focusables sont accessibles
      focusableElements.forEach((element, index) => {
        const htmlElement = element as HTMLElement;
        if (htmlElement.tabIndex < 0 && htmlElement.tabIndex !== -1) {
          issues.push(`Élément ${index + 1} a un tabIndex invalide: ${htmlElement.tabIndex}`);
        }
      });

      resolve({
        success: issues.length === 0,
        issues
      });
    });
  }

  /**
   * Simuler un lecteur d'écran (version simplifiée)
   */
  static simulateScreenReader(): Promise<{ success: boolean; content: string[] }> {
    return new Promise((resolve) => {
      const content: string[] = [];
      
      // Récupérer les titres
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        content.push(`Titre niveau ${heading.tagName.charAt(1)}: ${heading.textContent}`);
      });

      // Récupérer les liens
      const links = document.querySelectorAll('a[href]');
      links.forEach((link) => {
        content.push(`Lien: ${link.textContent || link.getAttribute('aria-label') || 'Sans texte'}`);
      });

      // Récupérer les boutons
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button) => {
        content.push(`Bouton: ${button.textContent || button.getAttribute('aria-label') || 'Sans texte'}`);
      });

      // Récupérer les images
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        const alt = img.getAttribute('alt');
        content.push(`Image: ${alt || 'Sans texte alternatif'}`);
      });

      resolve({
        success: true,
        content
      });
    });
  }

  /**
   * Vérifier les contrastes de couleurs
   */
  static checkColorContrasts(): Promise<{ success: boolean; issues: Array<{ element: string; ratio: number; required: number }> }> {
    return new Promise((resolve) => {
      const issues: Array<{ element: string; ratio: number; required: number }> = [];
      
      // Cette fonction nécessiterait une implémentation plus complexe
      // Pour l'instant, on simule quelques vérifications
      const textElements = document.querySelectorAll('p, span, div, button, a');
      
      textElements.forEach((element, index) => {
        const htmlElement = element as HTMLElement;
        const styles = window.getComputedStyle(htmlElement);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Simulation d'un calcul de contraste (dans un vrai projet, utiliser une librairie)
        if (color && backgroundColor && color !== backgroundColor) {
          const simulatedRatio = Math.random() * 10; // Simulation
          const requiredRatio = parseFloat(styles.fontSize) >= 18 ? 3 : 4.5;
          
          if (simulatedRatio < requiredRatio) {
            issues.push({
              element: `Élément ${index + 1} (${htmlElement.tagName.toLowerCase()})`,
              ratio: Math.round(simulatedRatio * 100) / 100,
              required: requiredRatio
            });
          }
        }
      });

      resolve({
        success: issues.length === 0,
        issues
      });
    });
  }

  /**
   * Obtenir des suggestions d'amélioration basées sur l'analyse
   */
  static getSuggestions(report: AccessibilityReport): string[] {
    const suggestions: string[] = [];
    
    if (report.score < 70) {
      suggestions.push('Le score d\'accessibilité est faible. Priorisez la correction des erreurs critiques.');
    }
    
    const errorCount = report.issues.filter(issue => issue.type === 'error').length;
    if (errorCount > 0) {
      suggestions.push(`${errorCount} erreur(s) critique(s) à corriger en priorité.`);
    }
    
    const warningCount = report.issues.filter(issue => issue.type === 'warning').length;
    if (warningCount > 0) {
      suggestions.push(`${warningCount} avertissement(s) à examiner.`);
    }
    
    // Ajouter les suggestions du rapport
    suggestions.push(...report.suggestions);
    
    return suggestions;
  }

  /**
   * Calculer la priorité d'un problème d'accessibilité
   */
  static getIssuePriority(issue: AccessibilityIssue): 'high' | 'medium' | 'low' {
    switch (issue.type) {
      case 'error':
        return 'high';
      case 'warning':
        return 'medium';
      case 'info':
        return 'low';
      default:
        return 'low';
    }
  }

  /**
   * Formater un problème d'accessibilité pour l'affichage
   */
  static formatIssue(issue: AccessibilityIssue): string {
    let formatted = issue.message;
    
    if (issue.element) {
      formatted += ` (${issue.element})`;
    }
    
    return formatted;
  }
}

export default AccessibilityService;
