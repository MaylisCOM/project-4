export interface Component {
  id: string;
  type: 'header' | 'text' | 'image' | 'button' | 'container' | 'hero' | 'feature-grid' | 
        'video' | 'separator' | 'icon' | 'quote' | 'gallery' | 'carousel' | 'accordion' | 
        'tabs' | 'counter' | 'timeline' | 'form' | 'map' | 'newsletter' | 'social' | 
        'testimonials' | 'calendar' | 'blog' | 'progress' | 'modal' | 'parallax' | 'overlay';
  content: any;
  styles: {
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    padding?: string;
    margin?: string;
    textAlign?: 'left' | 'center' | 'right';
    borderRadius?: string;
    zIndex?: number;
    opacity?: number;
    // Styles responsive
    desktop?: { [key: string]: any };
    tablet?: { [key: string]: any };
    mobile?: { [key: string]: any };
    [key: string]: any;
  };
  position: {
    x: number;
    y: number;
  };
  size: {
    width: string;
    height: string;
  };
  // Positions et tailles responsive
  responsivePosition?: {
    desktop?: { x: number; y: number };
    tablet?: { x: number; y: number };
    mobile?: { x: number; y: number };
  };
  responsiveSize?: {
    desktop?: { width: string; height: string };
    tablet?: { width: string; height: string };
    mobile?: { width: string; height: string };
  };
  locked?: boolean;
  visible?: boolean;
  layer?: number;
  seo?: {
    alt?: string;
    title?: string;
    description?: string;
    keywords?: string[];
  };
  accessibility?: {
    ariaLabel?: string;
    role?: string;
    tabIndex?: number;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'business' | 'portfolio' | 'landing' | 'blog' | 'ecommerce';
  components: Component[];
  isPremium: boolean;
  price?: number;
  author: string;
  rating: number;
  downloads: number;
  seoScore?: number;
  accessibilityScore?: number;
  performanceScore?: number;
}

export interface Project {
  id: string;
  name: string;
  components: Component[];
  pages?: Page[];
  currentPageId?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  url?: string;
  seoSettings?: {
    title?: string;
    description?: string;
    keywords?: string[];
    cities?: string[];
    language?: string;
    robots?: string;
    globalMeta?: { [key: string]: string };
  };
  performanceMetrics?: {
    loadTime?: number;
    seoScore?: number;
    accessibilityScore?: number;
    mobileScore?: number;
  };
  languages?: string[];
  currentLanguage?: string;
  branding?: {
    logo?: string;
    favicon?: string;
    companyName?: string;
  };
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  components: Component[];
  seoSettings?: {
    title?: string;
    description?: string;
    keywords?: string[];
    cities?: string[];
    customMeta?: { [key: string]: string };
  };
  isHomePage?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  preferences?: {
    language?: string;
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AIAssistant {
  generateContent: (type: string, context?: any) => Promise<string>;
  optimizeSEO: (content: string) => Promise<SEOSuggestions>;
  analyzeAccessibility: (component: Component) => Promise<AccessibilityReport>;
  suggestImprovements: (project: Project) => Promise<Suggestion[]>;
}

export interface SEOSuggestions {
  title?: string;
  description?: string;
  keywords?: string[];
  improvements?: string[];
  score?: number;
}

export interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
  suggestions: string[];
}

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  fix?: string;
  componentId?: string;
}

export interface Suggestion {
  type: 'seo' | 'performance' | 'accessibility' | 'design';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: () => void;
}

export interface FeedbackItem {
  id: string;
  userId: string;
  type: 'bug' | 'feature' | 'improvement' | 'question';
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  votes: number;
  responses?: FeedbackResponse[];
}

export interface FeedbackResponse {
  id: string;
  userId: string;
  message: string;
  createdAt: Date;
  isOfficial: boolean;
}
export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: Date;
  folder?: string;
}