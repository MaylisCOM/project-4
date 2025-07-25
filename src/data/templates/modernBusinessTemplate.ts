import { Component } from '../../types';

export const modernBusinessTemplate: Component[] = [
  // Navigation Header
  {
    id: 'nav-header',
    type: 'header',
    content: {
      text: 'MonEntreprise',
      level: 1
    },
    styles: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      fontSize: '24px',
      padding: '20px 40px',
      textAlign: 'left',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: 1000,
      fontWeight: 'bold'
    },
    position: { x: 0, y: 0 },
    size: { width: '100%', height: 'auto' }
  },

  // Hero Section Title
  {
    id: 'hero-title',
    type: 'header',
    content: {
      text: 'Transformez votre vision en réalité',
      level: 1
    },
    styles: {
      color: '#ffffff',
      fontSize: '48px',
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: '20px'
    },
    position: { x: 0, y: 100 },
    size: { width: '100%', height: 'auto' }
  },

  // Hero Section Subtitle
  {
    id: 'hero-subtitle',
    type: 'text',
    content: {
      text: 'Solutions digitales innovantes pour propulser votre entreprise vers le succès'
    },
    styles: {
      color: '#ffffff',
      fontSize: '20px',
      textAlign: 'center',
      marginBottom: '30px'
    },
    position: { x: 0, y: 180 },
    size: { width: '100%', height: 'auto' }
  },

  // Hero CTA Button
  {
    id: 'hero-cta',
    type: 'button',
    content: {
      text: 'Découvrir nos services'
    },
    styles: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      fontSize: '18px',
      padding: '15px 40px',
      borderRadius: '8px',
      textAlign: 'center',
      display: 'block',
      margin: '0 auto',
      cursor: 'pointer',
      border: 'none',
      fontWeight: '600'
    },
    position: { x: 0, y: 250 },
    size: { width: '250px', height: 'auto' }
  },

  // Services Section Title
  {
    id: 'services-title',
    type: 'header',
    content: {
      text: 'Nos Services',
      level: 2
    },
    styles: {
      color: '#1a1a1a',
      fontSize: '36px',
      textAlign: 'center',
      fontWeight: 'bold',
      marginTop: '80px',
      marginBottom: '50px'
    },
    position: { x: 0, y: 400 },
    size: { width: '100%', height: 'auto' }
  },

  // Service 1 - Développement Web
  {
    id: 'service-1-icon',
    type: 'icon',
    content: {
      icon: '💻',
      size: 48,
      color: '#3b82f6'
    },
    styles: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    position: { x: 50, y: 500 },
    size: { width: '250px', height: 'auto' }
  },
  {
    id: 'service-1-title',
    type: 'header',
    content: {
      text: 'Développement Web',
      level: 3
    },
    styles: {
      color: '#1a1a1a',
      fontSize: '24px',
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: '15px'
    },
    position: { x: 50, y: 580 },
    size: { width: '250px', height: 'auto' }
  },
  {
    id: 'service-1-desc',
    type: 'text',
    content: {
      text: 'Sites web modernes et performants avec les dernières technologies'
    },
    styles: {
      color: '#666666',
      fontSize: '16px',
      textAlign: 'center',
      lineHeight: '1.6'
    },
    position: { x: 50, y: 630 },
    size: { width: '250px', height: 'auto' }
  },

  // Service 2 - Design UX/UI
  {
    id: 'service-2-icon',
    type: 'icon',
    content: {
      icon: '🎨',
      size: 48,
      color: '#3b82f6'
    },
    styles: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    position: { x: 350, y: 500 },
    size: { width: '250px', height: 'auto' }
  },
  {
    id: 'service-2-title',
    type: 'header',
    content: {
      text: 'Design UX/UI',
      level: 3
    },
    styles: {
      color: '#1a1a1a',
      fontSize: '24px',
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: '15px'
    },
    position: { x: 350, y: 580 },
    size: { width: '250px', height: 'auto' }
  },
  {
    id: 'service-2-desc',
    type: 'text',
    content: {
      text: 'Interfaces utilisateur intuitives et expériences mémorables'
    },
    styles: {
      color: '#666666',
      fontSize: '16px',
      textAlign: 'center',
      lineHeight: '1.6'
    },
    position: { x: 350, y: 630 },
    size: { width: '250px', height: 'auto' }
  },

  // Service 3 - Marketing Digital
  {
    id: 'service-3-icon',
    type: 'icon',
    content: {
      icon: '📈',
      size: 48,
      color: '#3b82f6'
    },
    styles: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    position: { x: 650, y: 500 },
    size: { width: '250px', height: 'auto' }
  },
  {
    id: 'service-3-title',
    type: 'header',
    content: {
      text: 'Marketing Digital',
      level: 3
    },
    styles: {
      color: '#1a1a1a',
      fontSize: '24px',
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: '15px'
    },
    position: { x: 650, y: 580 },
    size: { width: '250px', height: 'auto' }
  },
  {
    id: 'service-3-desc',
    type: 'text',
    content: {
      text: 'Stratégies digitales pour maximiser votre visibilité en ligne'
    },
    styles: {
      color: '#666666',
      fontSize: '16px',
      textAlign: 'center',
      lineHeight: '1.6'
    },
    position: { x: 650, y: 630 },
    size: { width: '250px', height: 'auto' }
  },

  // Service 4 - Consulting
  {
    id: 'service-4-icon',
    type: 'icon',
    content: {
      icon: '🚀',
      size: 48,
      color: '#3b82f6'
    },
    styles: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    position: { x: 950, y: 500 },
    size: { width: '250px', height: 'auto' }
  },
  {
    id: 'service-4-title',
    type: 'header',
    content: {
      text: 'Consulting',
      level: 3
    },
    styles: {
      color: '#1a1a1a',
      fontSize: '24px',
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: '15px'
    },
    position: { x: 950, y: 580 },
    size: { width: '250px', height: 'auto' }
  },
  {
    id: 'service-4-desc',
    type: 'text',
    content: {
      text: 'Conseils experts pour optimiser votre transformation digitale'
    },
    styles: {
      color: '#666666',
      fontSize: '16px',
      textAlign: 'center',
      lineHeight: '1.6'
    },
    position: { x: 950, y: 630 },
    size: { width: '250px', height: 'auto' }
  },

  // About Section
  {
    id: 'about-title',
    type: 'header',
    content: {
      text: 'À Propos de Nous',
      level: 2
    },
    styles: {
      color: '#1a1a1a',
      fontSize: '36px',
      textAlign: 'center',
      fontWeight: 'bold',
      marginTop: '80px',
      marginBottom: '30px'
    },
    position: { x: 0, y: 800 },
    size: { width: '100%', height: 'auto' }
  },
  {
    id: 'about-content',
    type: 'text',
    content: {
      text: 'Depuis plus de 10 ans, nous accompagnons les entreprises dans leur transformation digitale. Notre équipe passionnée combine créativité et expertise technique pour créer des solutions sur mesure qui dépassent vos attentes.'
    },
    styles: {
      color: '#666666',
      fontSize: '18px',
      textAlign: 'center',
      lineHeight: '1.8',
      maxWidth: '800px',
      margin: '0 auto',
      marginBottom: '50px'
    },
    position: { x: 0, y: 880 },
    size: { width: '100%', height: 'auto' }
  },

  // Stats
  {
    id: 'stat-1',
    type: 'counter',
    content: {
      value: 500,
      label: 'Projets réalisés',
      duration: 2000
    },
    styles: {
      textAlign: 'center'
    },
    position: { x: 200, y: 1000 },
    size: { width: '200px', height: 'auto' }
  },
  {
    id: 'stat-2',
    type: 'counter',
    content: {
      value: 98,
      label: 'Clients satisfaits',
      duration: 2000,
      suffix: '%'
    },
    styles: {
      textAlign: 'center'
    },
    position: { x: 500, y: 1000 },
    size: { width: '200px', height: 'auto' }
  },
  {
    id: 'stat-3',
    type: 'text',
    content: {
      text: '24/7'
    },
    styles: {
      color: '#3b82f6',
      fontSize: '36px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '10px'
    },
    position: { x: 800, y: 1000 },
    size: { width: '200px', height: 'auto' }
  },
  {
    id: 'stat-3-label',
    type: 'text',
    content: {
      text: 'Support client'
    },
    styles: {
      color: '#666666',
      fontSize: '16px',
      textAlign: 'center'
    },
    position: { x: 800, y: 1050 },
    size: { width: '200px', height: 'auto' }
  },

  // Footer
  {
    id: 'footer-company',
    type: 'header',
    content: {
      text: 'MonEntreprise',
      level: 3
    },
    styles: {
      color: '#ffffff',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px'
    },
    position: { x: 50, y: 1200 },
    size: { width: '300px', height: 'auto' }
  },
  {
    id: 'footer-desc',
    type: 'text',
    content: {
      text: 'Votre partenaire de confiance pour tous vos projets digitaux. Innovation, qualité et excellence à votre service.'
    },
    styles: {
      color: '#cccccc',
      fontSize: '14px',
      lineHeight: '1.6'
    },
    position: { x: 50, y: 1250 },
    size: { width: '300px', height: 'auto' }
  },

  // Contact Info
  {
    id: 'contact-title',
    type: 'header',
    content: {
      text: 'Contact',
      level: 4
    },
    styles: {
      color: '#ffffff',
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '15px'
    },
    position: { x: 800, y: 1200 },
    size: { width: '300px', height: 'auto' }
  },
  {
    id: 'contact-email',
    type: 'text',
    content: {
      text: '📧 contact@monentreprise.com'
    },
    styles: {
      color: '#cccccc',
      fontSize: '14px',
      marginBottom: '10px'
    },
    position: { x: 800, y: 1240 },
    size: { width: '300px', height: 'auto' }
  },
  {
    id: 'contact-phone',
    type: 'text',
    content: {
      text: '📞 +33 1 23 45 67 89'
    },
    styles: {
      color: '#cccccc',
      fontSize: '14px',
      marginBottom: '10px'
    },
    position: { x: 800, y: 1270 },
    size: { width: '300px', height: 'auto' }
  },
  {
    id: 'contact-address',
    type: 'text',
    content: {
      text: '📍 123 Rue de l\'Innovation, Paris'
    },
    styles: {
      color: '#cccccc',
      fontSize: '14px'
    },
    position: { x: 800, y: 1300 },
    size: { width: '300px', height: 'auto' }
  },

  // Copyright
  {
    id: 'copyright',
    type: 'text',
    content: {
      text: '© 2024 MonEntreprise. Tous droits réservés.'
    },
    styles: {
      color: '#999999',
      fontSize: '12px',
      textAlign: 'center',
      marginTop: '40px'
    },
    position: { x: 0, y: 1400 },
    size: { width: '100%', height: 'auto' }
  }
];
