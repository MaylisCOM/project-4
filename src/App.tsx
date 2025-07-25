import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Search, Eye, Zap } from 'lucide-react';
import LandingPage from './components/Landing/LandingPage';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Canvas from './components/Editor/Canvas';
import PropertyPanel from './components/Editor/PropertyPanel';
import AIAssistant from './components/AI/AIAssistant';
import SEOPanel from './components/SEO/SEOPanel';
import AccessibilityPanel from './components/Accessibility/AccessibilityPanel';
import PerformancePanel from './components/Performance/PerformancePanel';
import FeedbackSystem from './components/Feedback/FeedbackSystem';
import LanguageManager from './components/MultiLanguage/LanguageManager';
import StatsDashboard from './components/Dashboard/StatsDashboard';
import ToastContainer from './components/UI/ToastContainer';
import { ToastProps } from './components/UI/Toast';
import { Component, Project, Suggestion, FeedbackItem, AuthUser, AuthState, Page, MediaItem } from './types';

// Services API
import AuthService from './services/authService';
import ProjectService from './services/projectService';
import FeedbackService from './services/feedbackService';
import MediaService from './services/mediaService';

// Initialize AOS
import AOS from 'aos';

function App() {
  React.useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  // Auth state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });
  const [authMode, setAuthMode] = useState<'landing' | 'login' | 'register'>('landing');
  
  // Editor state
  const [activePanel, setActivePanel] = useState<'properties' | 'seo' | 'accessibility' | 'performance' | null>('properties');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSidebarPanel, setActiveSidebarPanel] = useState('components');
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | undefined>();
  const [pages, setPages] = useState<Page[]>([
    {
      id: 'home',
      name: 'Accueil',
      slug: '',
      components: [],
      isHomePage: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  const [currentPageId, setCurrentPageId] = useState('home');
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [projectName, setProjectName] = useState('Nouveau projet');
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([
    {
      id: '1',
      name: 'hero-image.jpg',
      url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'image',
      size: 245760,
      uploadedAt: new Date('2025-01-15')
    },
    {
      id: '2',
      name: 'business-team.jpg',
      url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'image',
      size: 189440,
      uploadedAt: new Date('2025-01-14')
    },
    {
      id: '3',
      name: 'portfolio-work.jpg',
      url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'image',
      size: 167890,
      uploadedAt: new Date('2025-01-13')
    }
  ]);
  const [currentProject, setCurrentProject] = useState<Project>({
    id: 'current-project',
    name: projectName,
    components: components,
    pages: pages,
    currentPageId: currentPageId,
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublished: false,
    languages: ['fr'],
    currentLanguage: 'fr',
    seoSettings: {
      title: '',
      description: '',
      keywords: [],
      language: 'fr',
      robots: 'index, follow'
    },
    performanceMetrics: {
      loadTime: 2.3,
      seoScore: 78,
      accessibilityScore: 85,
      mobileScore: 95
    },
    branding: {
      logo: undefined,
      favicon: undefined,
      companyName: ''
    }
  });

  // Auth functions
  const handleLogin = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await AuthService.login({ email, password });
      
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await AuthService.register({ name, email, password });
      
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      setAuthMode('landing');
      // Reset editor state
      setComponents([]);
      setSelectedComponentId(undefined);
      setProjectName('Nouveau projet');
      setShowStats(false);
    }
  };

  // Initialisation de l'authentification au démarrage
  useEffect(() => {
    const initAuth = async () => {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      try {
        const authState = await AuthService.initializeAuth();
        setAuthState(authState);
      } catch (error) {
        console.error('Erreur d\'initialisation de l\'authentification:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    initAuth();
  }, []);

  const handleComponentAdd = useCallback((component: Component) => {
    setComponents(prev => [...prev, component]);
    setSelectedComponentId(component.id);
    
    // Mettre à jour la page actuelle
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? { ...page, components: [...page.components, component], updatedAt: new Date() }
        : page
    ));
    
    setCurrentProject(prev => ({
      ...prev,
      components: [...prev.components, component],
      pages: prev.pages?.map(page => 
        page.id === currentPageId 
          ? { ...page, components: [...page.components, component], updatedAt: new Date() }
          : page
      ),
      updatedAt: new Date()
    }));
  }, []);

  const handleComponentUpdate = useCallback((id: string, updates: Partial<Component>) => {
    console.log('handleComponentUpdate appelé pour:', id, 'avec:', updates);
    
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ));
    
    // Mettre à jour la page actuelle
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? { 
            ...page, 
            components: page.components.map(comp => 
              comp.id === id ? { ...comp, ...updates } : comp
            ),
            updatedAt: new Date()
          }
        : page
    ));
    
    setCurrentProject(prev => ({
      ...prev,
      components: prev.components.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      ),
      pages: prev.pages?.map(page => 
        page.id === currentPageId 
          ? { 
              ...page, 
              components: page.components.map(comp => 
                comp.id === id ? { ...comp, ...updates } : comp
              ),
              updatedAt: new Date()
            }
          : page
      ),
      updatedAt: new Date()
    }));
    
    // Forcer un re-render si c'est une image
    if (updates.content && updates.content.src) {
      console.log('Forçage du re-render pour image avec nouvelle URL:', updates.content.src);
    }
    
    console.log('Composants mis à jour');
  }, [currentPageId]);

  const handleComponentDelete = useCallback((id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    setSelectedComponentId(undefined);
    
    // Mettre à jour la page actuelle
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? { 
            ...page, 
            components: page.components.filter(comp => comp.id !== id),
            updatedAt: new Date()
          }
        : page
    ));
    
    setCurrentProject(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== id),
      pages: prev.pages?.map(page => 
        page.id === currentPageId 
          ? { 
              ...page, 
              components: page.components.filter(comp => comp.id !== id),
              updatedAt: new Date()
            }
          : page
      ),
      updatedAt: new Date()
    }));
  }, [currentPageId]);

  const handleComponentDuplicate = useCallback((id: string) => {
    const component = components.find(comp => comp.id === id);
    if (component) {
      const duplicatedComponent: Component = {
        ...component,
        id: `${component.type}-${Date.now()}`,
        position: {
          x: component.position.x + 20,
          y: component.position.y + 20
        }
      };
      handleComponentAdd(duplicatedComponent);
    }
  }, [components, handleComponentAdd]);

  const handleComponentLock = useCallback((id: string, locked: boolean) => {
    handleComponentUpdate(id, { locked });
  }, [handleComponentUpdate]);

  const handleComponentVisibility = useCallback((id: string, visible: boolean) => {
    handleComponentUpdate(id, { visible });
  }, [handleComponentUpdate]);

  const handleComponentSelect = useCallback((id: string) => {
    if (id) {
      setSelectedComponentId(id);
      setActivePanel('properties');
    } else {
      setSelectedComponentId(undefined);
    }
  }, []);

  // Fonctions utilitaires pour les toasts
  const addToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast
    };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      // Préparer les données pour la sauvegarde
      const saveData = {
        components: components,
        pages: pages,
        currentPageId: currentPageId
      };

      // Appeler l'API de sauvegarde
      await ProjectService.saveProjectState(currentProject.id, saveData);
      
      // Mettre à jour l'état local
      setCurrentProject(prev => ({
        ...prev,
        name: projectName,
        components: components,
        pages: pages,
        updatedAt: new Date()
      }));

      // Afficher le message de succès
      addToast({
        type: 'success',
        title: 'Projet sauvegardé',
        message: 'Votre travail a été sauvegardé avec succès',
        duration: 3000
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // Afficher le message d'erreur
      addToast({
        type: 'error',
        title: 'Erreur de sauvegarde',
        message: 'Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.',
        duration: 5000
      });
    } finally {
      setIsSaving(false);
    }
  }, [projectName, components, pages, currentProject.id, isSaving, addToast]);

  const handlePublish = useCallback(() => {
    console.log('Publication du projet:', { projectName, components });
    setCurrentProject(prev => ({
      ...prev,
      isPublished: true,
      url: `https://${projectName.toLowerCase().replace(/\s+/g, '-')}.webuiz.com`,
      updatedAt: new Date()
    }));
    // Ici on pourrait publier le site
  }, [projectName, components]);

  // Nouvelles fonctions pour les fonctionnalités avancées
  const handleAISuggestion = useCallback((suggestion: Suggestion) => {
    console.log('Application de la suggestion IA:', suggestion);
    // Logique pour appliquer les suggestions IA
  }, []);

  const handleAIContentGeneration = useCallback((type: string, content: string) => {
    if (selectedComponentId) {
      const updates: Partial<Component> = {};
      if (type === 'title') {
        updates.content = { ...components.find(c => c.id === selectedComponentId)?.content, text: content };
      } else if (type === 'description') {
        updates.content = { ...components.find(c => c.id === selectedComponentId)?.content, text: content };
      }
      handleComponentUpdate(selectedComponentId, updates);
    }
  }, [selectedComponentId, components, handleComponentUpdate]);

  const handleSEOUpdate = useCallback((seoSettings: any) => {
    setCurrentProject(prev => ({
      ...prev,
      seoSettings: { ...prev.seoSettings, ...seoSettings },
      updatedAt: new Date()
    }));
  }, []);

  const handlePageSEOUpdate = useCallback((pageId: string, seoSettings: any) => {
    setPages(prev => prev.map(page => 
      page.id === pageId 
        ? { ...page, seoSettings: { ...page.seoSettings, ...seoSettings }, updatedAt: new Date() }
        : page
    ));
    
    setCurrentProject(prev => ({
      ...prev,
      pages: prev.pages?.map(page => 
        page.id === pageId 
          ? { ...page, seoSettings: { ...page.seoSettings, ...seoSettings }, updatedAt: new Date() }
          : page
      ),
      updatedAt: new Date()
    }));
  }, []);
  const handlePerformanceOptimization = useCallback((optimizations: string[]) => {
    console.log('Application des optimisations:', optimizations);
    // Logique pour appliquer les optimisations de performance
  }, []);

  const handleFeedbackSubmit = useCallback(async (feedback: Partial<FeedbackItem>) => {
    try {
      if (!feedback.type || !feedback.title || !feedback.description) {
        throw new Error('Type, titre et description requis');
      }

      const response = await FeedbackService.createFeedback({
        type: feedback.type as 'bug' | 'feature' | 'improvement' | 'question',
        title: feedback.title,
        description: feedback.description,
        priority: feedback.priority as 'low' | 'medium' | 'high' | 'critical' || 'medium'
      });

      console.log('Feedback créé avec succès:', response.feedback);
      return response;
    } catch (error) {
      console.error('Erreur lors de la création du feedback:', error);
      throw error;
    }
  }, []);

  const handleLanguageChange = useCallback((language: string) => {
    setCurrentProject(prev => ({
      ...prev,
      currentLanguage: language,
      updatedAt: new Date()
    }));
  }, []);

  const handleAddLanguage = useCallback((language: string) => {
    setCurrentProject(prev => ({
      ...prev,
      languages: [...(prev.languages || []), language],
      updatedAt: new Date()
    }));
  }, []);

  const handleRemoveLanguage = useCallback((language: string) => {
    setCurrentProject(prev => ({
      ...prev,
      languages: (prev.languages || []).filter(lang => lang !== language),
      updatedAt: new Date()
    }));
  }, []);

  const handleTranslateContent = useCallback((targetLanguage: string) => {
    console.log('Traduction vers:', targetLanguage);
    // Logique pour traduire le contenu
  }, []);

  const handleUpdateProject = useCallback((updates: Partial<Project>) => {
    setCurrentProject(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date()
    }));
  }, []);

  const handleAddToMediaLibrary = useCallback(async (file: File, url?: string) => {
    try {
      // Si une URL est fournie, créer un objet MediaItem directement
      if (url) {
        const newMedia: MediaItem = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          url,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          size: file.size,
          uploadedAt: new Date()
        };
        setMediaLibrary(prev => [newMedia, ...prev]);
        return newMedia;
      }

      // Sinon, uploader le fichier via l'API
      const response = await MediaService.uploadMedia(file, currentProject.id);
      const newMedia = response.media;
      
      setMediaLibrary(prev => [newMedia, ...prev]);
      return newMedia;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du média:', error);
      throw error;
    }
  }, [currentProject.id]);

  // Fonctions de gestion des pages
  const handlePageChange = useCallback((pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setCurrentPageId(pageId);
      setComponents(page.components);
      setSelectedComponentId(undefined);
    }
  }, [pages]);

  const handlePageCreate = useCallback((pageName: string) => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      name: pageName,
      slug: pageName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      components: [],
      isHomePage: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setPages(prev => [...prev, newPage]);
    setCurrentPageId(newPage.id);
    setComponents([]);
    setSelectedComponentId(undefined);
  }, []);

  const handlePageDelete = useCallback((pageId: string) => {
    if (pages.length > 1) {
      setPages(prev => prev.filter(p => p.id !== pageId));
      
      // Si on supprime la page actuelle, basculer vers la première page
      if (currentPageId === pageId) {
        const remainingPages = pages.filter(p => p.id !== pageId);
        const firstPage = remainingPages[0];
        if (firstPage) {
          setCurrentPageId(firstPage.id);
          setComponents(firstPage.components);
          setSelectedComponentId(undefined);
        }
      }
    }
  }, [pages, currentPageId]);

  const selectedComponent = components.find(comp => comp.id === selectedComponentId);

  // Show landing page if not authenticated
  if (!authState.isAuthenticated) {
    if (authMode === 'landing') {
      return <LandingPage onGetStarted={() => setAuthMode('login')} />;
    }
    
    if (authMode === 'login') {
      return (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthMode('register')}
          isLoading={authState.isLoading}
        />
      );
    }
    
    if (authMode === 'register') {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthMode('login')}
          isLoading={authState.isLoading}
        />
      );
    }
  }

  // Main editor interface
  return (
    <div className="h-screen flex flex-col theme-bg">
      <Header
        onPreview={() => setIsPreviewMode(!isPreviewMode)}
        onSave={handleSave}
        onPublish={handlePublish}
        onStats={() => setShowStats(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        isPreviewMode={isPreviewMode}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onComponentAdd={handleComponentAdd}
        onLogout={handleLogout}
        userName={authState.user?.name || ''}
        mediaLibrary={mediaLibrary}
        onAddToMediaLibrary={handleAddToMediaLibrary}
        currentProject={currentProject}
        onSubmitFeedback={handleFeedbackSubmit}
        isSaving={isSaving}
      />
      
      <div className="flex flex-1 h-full overflow-hidden">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activePanel={activeSidebarPanel}
          onPanelChange={setActiveSidebarPanel}
          onPageChange={handlePageChange}
          onPageCreate={handlePageCreate}
          onPageDelete={handlePageDelete}
          pages={pages}
          currentPageId={currentPageId}
          onLanguageChange={handleLanguageChange}
          onAddLanguage={handleAddLanguage}
          onRemoveLanguage={handleRemoveLanguage}
          currentLanguage={currentProject.currentLanguage}
          availableLanguages={currentProject.languages}
          currentProject={currentProject}
          onUpdateProject={handleUpdateProject}
          onAddToMediaLibrary={handleAddToMediaLibrary}
          onSubmitFeedback={handleFeedbackSubmit}
        />
        
        <Canvas
          components={components}
          onComponentUpdate={handleComponentUpdate}
          onComponentSelect={handleComponentSelect}
          onComponentAdd={handleComponentAdd}
          onComponentDelete={handleComponentDelete}
          onComponentDuplicate={handleComponentDuplicate}
          onComponentLock={handleComponentLock}
          onComponentVisibility={handleComponentVisibility}
          selectedComponentId={selectedComponentId}
          viewMode={viewMode}
          isPreviewMode={isPreviewMode}
          showGrid={showGrid}
          snapToGrid={snapToGrid}
          mediaLibrary={mediaLibrary}
          onAddToMediaLibrary={handleAddToMediaLibrary}
        />
        
        {!isPreviewMode && (
          <div className="flex">
            {/* Panel Selector */}
            <div className="w-12 bg-gray-50 border-l border-gray-200 flex flex-col">
              <button
                onClick={() => setActivePanel(activePanel === 'properties' ? null : 'properties')}
                className={`p-3 border-b border-gray-200 hover:bg-gray-200 ${
                  activePanel === 'properties' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                }`}
                title="Propriétés"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => setActivePanel(activePanel === 'seo' ? null : 'seo')}
                className={`p-3 border-b border-gray-200 hover:bg-gray-200 ${
                  activePanel === 'seo' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                }`}
                title="SEO"
              >
                <Search size={16} />
              </button>
              <button
                onClick={() => setActivePanel(activePanel === 'accessibility' ? null : 'accessibility')}
                className={`p-3 border-b border-gray-200 hover:bg-gray-200 ${
                  activePanel === 'accessibility' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                }`}
                title="Accessibilité"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => setActivePanel(activePanel === 'performance' ? null : 'performance')}
                className={`p-3 border-b border-gray-200 hover:bg-gray-200 ${
                  activePanel === 'performance' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                }`}
                title="Performance"
              >
                <Zap size={16} />
              </button>
            </div>

            {/* Active Panel */}
            {activePanel === 'properties' && selectedComponent && (
              <PropertyPanel
                component={selectedComponent}
                onUpdate={(updates) => handleComponentUpdate(selectedComponent.id, updates)}
                onClose={() => setSelectedComponentId(undefined)}
                mediaLibrary={mediaLibrary}
                onAddToMediaLibrary={handleAddToMediaLibrary}
              />
            )}
            {activePanel === 'seo' && (
              <SEOPanel
                project={currentProject}
                pages={pages}
                currentPageId={currentPageId}
                onUpdateSEO={handleSEOUpdate}
                onUpdatePageSEO={handlePageSEOUpdate}
              />
            )}
            {activePanel === 'accessibility' && (
              <AccessibilityPanel
                projectId={currentProject.id}
                components={components}
                onUpdateComponent={handleComponentUpdate}
              />
            )}
            {activePanel === 'performance' && (
              <PerformancePanel
                project={currentProject}
                onOptimize={handlePerformanceOptimization}
              />
            )}
          </div>
        )}
      </div>

      {/* Composants flottants */}
      {authState.isAuthenticated && (
        <>
          <AIAssistant
            project={currentProject}
            selectedComponent={selectedComponent}
            onApplySuggestion={handleAISuggestion}
            onGenerateContent={handleAIContentGeneration}
          />
        </>
      )}

      {/* Stats Dashboard */}
      <AnimatePresence>
        {showStats && (
          <StatsDashboard onClose={() => setShowStats(false)} />
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}

export default App;