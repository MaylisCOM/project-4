export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  fix?: string;
  componentId?: string;
}

export interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
  suggestions: string[];
  componentAnalysis: ComponentAccessibilityAnalysis[];
}

export interface ComponentAccessibilityAnalysis {
  componentId: string;
  componentType: string;
  score: number;
  issues: AccessibilityIssue[];
}

export interface ComponentData {
  id: string;
  type: string;
  content: string | Record<string, unknown>;
  styles: string | Record<string, unknown>;
  width: string;
  height: string;
  seoAlt?: string;
  ariaLabel?: string;
  role?: string;
  tabIndex?: number;
}

export interface ParsedContent {
  alt?: string;
  text?: string;
  decorative?: boolean;
  level?: number;
  fields?: FormField[];
  captions?: boolean;
  subtitles?: boolean;
  autoplay?: boolean;
  [key: string]: unknown;
}

export interface ParsedStyles {
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  opacity?: string;
  [key: string]: unknown;
}

export interface FormField {
  label?: string;
  ariaLabel?: string;
  required?: boolean;
  ariaRequired?: boolean;
}

export class AccessibilityService {
  
  /**
   * Analyse l'accessibilité d'un projet complet
   */
  static analyzeProject(components: ComponentData[]): AccessibilityReport {
    const allIssues: AccessibilityIssue[] = [];
    const componentAnalyses: ComponentAccessibilityAnalysis[] = [];
    
    components.forEach(component => {
      const analysis = this.analyzeComponent(component);
      componentAnalyses.push(analysis);
      allIssues.push(...analysis.issues);
    });

    const score = this.calculateOverallScore(allIssues, components.length);
    const suggestions = this.generateSuggestions(allIssues);

    return {
      score,
      issues: allIssues,
      suggestions,
      componentAnalysis: componentAnalyses
    };
  }

  /**
   * Analyse l'accessibilité d'un composant individuel
   */
  static analyzeComponent(component: ComponentData): ComponentAccessibilityAnalysis {
    const issues: AccessibilityIssue[] = [];
    const content = typeof component.content === 'string' ? JSON.parse(component.content) : component.content;
    const styles = typeof component.styles === 'string' ? JSON.parse(component.styles) : component.styles;

    // Analyse selon le type de composant
    switch (component.type) {
      case 'image':
        this.analyzeImageComponent(component, content, issues);
        break;
      case 'button':
        this.analyzeButtonComponent(component, content, styles, issues);
        break;
      case 'text':
      case 'header':
        this.analyzeTextComponent(component, content, styles, issues);
        break;
      case 'form':
        this.analyzeFormComponent(component, content, issues);
        break;
      case 'video':
        this.analyzeVideoComponent(component, content, issues);
        break;
      default:
        this.analyzeGenericComponent(component, content, styles, issues);
    }

    // Vérifications générales pour tous les composants
    this.analyzeGeneralAccessibility(component, issues);

    const score = this.calculateComponentScore(issues);

    return {
      componentId: component.id,
      componentType: component.type,
      score,
      issues
    };
  }

  /**
   * Analyse spécifique aux images
   */
  private static analyzeImageComponent(component: ComponentData, content: ParsedContent, issues: AccessibilityIssue[]) {
    // Vérifier le texte alternatif
    if (!component.seoAlt && !content.alt) {
      issues.push({
        type: 'error',
        message: 'Image sans texte alternatif',
        element: `${component.type}#${component.id}`,
        fix: 'Ajouter un attribut alt descriptif',
        componentId: component.id
      });
    }

    // Vérifier si l'image est décorative
    if (content.decorative === true && (component.seoAlt || content.alt)) {
      issues.push({
        type: 'warning',
        message: 'Image décorative avec texte alternatif',
        element: `${component.type}#${component.id}`,
        fix: 'Supprimer le texte alternatif pour les images décoratives',
        componentId: component.id
      });
    }
  }

  /**
   * Analyse spécifique aux boutons
   */
  private static analyzeButtonComponent(component: ComponentData, content: ParsedContent, styles: ParsedStyles, issues: AccessibilityIssue[]) {
    // Vérifier le texte du bouton
    if (!content.text && !component.ariaLabel) {
      issues.push({
        type: 'error',
        message: 'Bouton sans texte ni label ARIA',
        element: `${component.type}#${component.id}`,
        fix: 'Ajouter du texte au bouton ou un aria-label',
        componentId: component.id
      });
    }

    // Vérifier le contraste
    if (styles.backgroundColor && styles.color) {
      const contrastRatio = this.calculateContrastRatio(styles.color, styles.backgroundColor);
      if (contrastRatio < 4.5) {
        issues.push({
          type: 'warning',
          message: 'Contraste insuffisant pour le bouton',
          element: `${component.type}#${component.id}`,
          fix: 'Utiliser des couleurs avec un contraste d\'au moins 4.5:1',
          componentId: component.id
        });
      }
    }

    // Vérifier la taille minimale
    const width = parseInt(component.width);
    const height = parseInt(component.height);
    if (width < 44 || height < 44) {
      issues.push({
        type: 'warning',
        message: 'Bouton trop petit pour l\'interaction tactile',
        element: `${component.type}#${component.id}`,
        fix: 'Augmenter la taille à au moins 44x44 pixels',
        componentId: component.id
      });
    }
  }

  /**
   * Analyse spécifique au texte
   */
  private static analyzeTextComponent(component: ComponentData, content: ParsedContent, styles: ParsedStyles, issues: AccessibilityIssue[]) {
    // Vérifier le contraste du texte
    if (styles.color && styles.backgroundColor) {
      const contrastRatio = this.calculateContrastRatio(styles.color, styles.backgroundColor);
      const minContrast = styles.fontSize && parseInt(styles.fontSize) >= 18 ? 3 : 4.5;
      
      if (contrastRatio < minContrast) {
        issues.push({
          type: 'warning',
          message: 'Contraste de texte insuffisant',
          element: `${component.type}#${component.id}`,
          fix: `Utiliser des couleurs avec un contraste d'au moins ${minContrast}:1`,
          componentId: component.id
        });
      }
    }

    // Vérifier la structure des titres
    if (component.type === 'header' && content.level) {
      // Cette vérification nécessiterait le contexte de tous les composants
      // Pour l'instant, on peut juste vérifier si c'est un titre valide
      if (content.level < 1 || content.level > 6) {
        issues.push({
          type: 'error',
          message: 'Niveau de titre invalide',
          element: `${component.type}#${component.id}`,
          fix: 'Utiliser un niveau de titre entre H1 et H6',
          componentId: component.id
        });
      }
    }
  }

  /**
   * Analyse spécifique aux formulaires
   */
  private static analyzeFormComponent(component: ComponentData, content: ParsedContent, issues: AccessibilityIssue[]) {
    // Vérifier les labels des champs
    if (content.fields) {
      content.fields.forEach((field: FormField, index: number) => {
        if (!field.label && !field.ariaLabel) {
          issues.push({
            type: 'error',
            message: `Champ de formulaire sans label (champ ${index + 1})`,
            element: `${component.type}#${component.id}`,
            fix: 'Ajouter un label visible ou un aria-label',
            componentId: component.id
          });
        }

        // Vérifier les champs requis
        if (field.required && !field.ariaRequired) {
          issues.push({
            type: 'info',
            message: `Champ requis sans indication ARIA (champ ${index + 1})`,
            element: `${component.type}#${component.id}`,
            fix: 'Ajouter aria-required="true"',
            componentId: component.id
          });
        }
      });
    }
  }

  /**
   * Analyse spécifique aux vidéos
   */
  private static analyzeVideoComponent(component: ComponentData, content: ParsedContent, issues: AccessibilityIssue[]) {
    // Vérifier les sous-titres
    if (!content.captions && !content.subtitles) {
      issues.push({
        type: 'warning',
        message: 'Vidéo sans sous-titres',
        element: `${component.type}#${component.id}`,
        fix: 'Ajouter des sous-titres ou des transcriptions',
        componentId: component.id
      });
    }

    // Vérifier l'autoplay
    if (content.autoplay) {
      issues.push({
        type: 'warning',
        message: 'Vidéo avec lecture automatique',
        element: `${component.type}#${component.id}`,
        fix: 'Éviter la lecture automatique ou fournir un contrôle',
        componentId: component.id
      });
    }
  }

  /**
   * Analyse générique pour tous les composants
   */
  private static analyzeGenericComponent(component: ComponentData, content: ParsedContent, styles: ParsedStyles, issues: AccessibilityIssue[]) {
    // Vérifications générales qui peuvent s'appliquer à tous les composants
    if (styles.opacity && parseFloat(styles.opacity) < 0.3) {
      issues.push({
        type: 'warning',
        message: 'Élément avec opacité très faible',
        element: `${component.type}#${component.id}`,
        fix: 'Augmenter l\'opacité pour améliorer la visibilité',
        componentId: component.id
      });
    }
  }

  /**
   * Vérifications générales d'accessibilité
   */
  private static analyzeGeneralAccessibility(component: ComponentData, issues: AccessibilityIssue[]) {
    // Vérifier le tabIndex
    if (component.tabIndex && component.tabIndex < -1) {
      issues.push({
        type: 'warning',
        message: 'TabIndex invalide',
        element: `${component.type}#${component.id}`,
        fix: 'Utiliser tabindex="0", tabindex="-1" ou supprimer l\'attribut',
        componentId: component.id
      });
    }

    // Vérifier les rôles ARIA
    if (component.role && !this.isValidAriaRole(component.role)) {
      issues.push({
        type: 'error',
        message: 'Rôle ARIA invalide',
        element: `${component.type}#${component.id}`,
        fix: 'Utiliser un rôle ARIA valide ou supprimer l\'attribut',
        componentId: component.id
      });
    }
  }

  /**
   * Calcule le ratio de contraste entre deux couleurs
   */
  private static calculateContrastRatio(color1: string, color2: string): number {
    // Implémentation simplifiée - dans un vrai projet, utiliser une librairie comme chroma-js
    // Pour l'instant, on retourne une valeur par défaut
    const luminance1 = this.getLuminance(color1);
    const luminance2 = this.getLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Calcule la luminance d'une couleur
   */
  private static getLuminance(color: string): number {
    // Implémentation simplifiée
    // Dans un vrai projet, parser correctement les couleurs hex, rgb, etc.
    if (color === '#ffffff' || color === 'white') return 1;
    if (color === '#000000' || color === 'black') return 0;
    return 0.5; // Valeur par défaut
  }

  /**
   * Vérifie si un rôle ARIA est valide
   */
  private static isValidAriaRole(role: string): boolean {
    const validRoles = [
      'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
      'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
      'contentinfo', 'definition', 'dialog', 'directory', 'document',
      'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
      'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
      'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
      'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation',
      'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
      'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
      'slider', 'spinbutton', 'status', 'switch', 'tab', 'table',
      'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar',
      'tooltip', 'tree', 'treegrid', 'treeitem'
    ];
    
    return validRoles.includes(role);
  }

  /**
   * Calcule le score d'un composant basé sur ses problèmes
   */
  private static calculateComponentScore(issues: AccessibilityIssue[]): number {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.type) {
        case 'error':
          score -= 15;
          break;
        case 'warning':
          score -= 8;
          break;
        case 'info':
          score -= 3;
          break;
      }
    });
    
    return Math.max(0, score);
  }

  /**
   * Calcule le score global du projet
   */
  private static calculateOverallScore(issues: AccessibilityIssue[], componentCount: number): number {
    if (componentCount === 0) return 100;
    
    let totalDeduction = 0;
    
    issues.forEach(issue => {
      switch (issue.type) {
        case 'error':
          totalDeduction += 10;
          break;
        case 'warning':
          totalDeduction += 5;
          break;
        case 'info':
          totalDeduction += 2;
          break;
      }
    });
    
    // Normaliser par rapport au nombre de composants
    const averageDeduction = totalDeduction / componentCount;
    const score = Math.max(0, 100 - averageDeduction);
    
    return Math.round(score);
  }

  /**
   * Génère des suggestions d'amélioration
   */
  private static generateSuggestions(issues: AccessibilityIssue[]): string[] {
    const suggestions: string[] = [];
    const issueTypes = new Set(issues.map(issue => issue.type));
    
    if (issues.some(issue => issue.message.includes('texte alternatif'))) {
      suggestions.push('Ajouter des textes alternatifs descriptifs à toutes les images');
    }
    
    if (issues.some(issue => issue.message.includes('contraste'))) {
      suggestions.push('Améliorer le contraste des couleurs pour respecter les standards WCAG');
    }
    
    if (issues.some(issue => issue.message.includes('label'))) {
      suggestions.push('Ajouter des labels appropriés aux éléments interactifs');
    }
    
    if (issues.some(issue => issue.message.includes('titre'))) {
      suggestions.push('Structurer le contenu avec une hiérarchie de titres logique');
    }
    
    if (issues.some(issue => issue.message.includes('ARIA'))) {
      suggestions.push('Utiliser les attributs ARIA pour améliorer l\'accessibilité');
    }
    
    if (issues.some(issue => issue.message.includes('taille'))) {
      suggestions.push('Respecter les tailles minimales pour les éléments interactifs');
    }
    
    // Suggestions générales
    if (issueTypes.has('error')) {
      suggestions.push('Corriger en priorité les erreurs d\'accessibilité critiques');
    }
    
    suggestions.push('Tester la navigation au clavier sur tous les éléments interactifs');
    suggestions.push('Vérifier la compatibilité avec les lecteurs d\'écran');
    
    return suggestions;
  }

  /**
   * Génère des corrections automatiques pour certains problèmes
   */
  static generateAutomaticFixes(issue: AccessibilityIssue, component: ComponentData): Record<string, unknown> {
    const fixes: Record<string, unknown> = {};
    
    switch (issue.message) {
      case 'Image sans texte alternatif':
        fixes.seoAlt = `Description de l'image ${component.id}`;
        break;
        
      case 'Bouton sans texte ni label ARIA':
        fixes.ariaLabel = `Bouton ${component.id}`;
        break;
        
      case 'TabIndex invalide':
        fixes.tabIndex = 0;
        break;
        
      case 'Champ de formulaire sans label':
        fixes.ariaLabel = `Champ ${component.id}`;
        break;
    }
    
    return fixes;
  }
}
