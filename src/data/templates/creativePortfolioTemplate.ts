import { Component } from '../../types';

export const creativePortfolioTemplate: Component[] = [
  // Navigation Header
  {
    id: 'nav-header',
    type: 'header',
    content: {
      text: 'Creative Studio',
      level: 1
    },
    styles: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: '#ffffff',
      fontSize: '24px',
      padding: '20px 40px',
      textAlign: 'left',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: 1000,
      fontWeight: 'bold',
      backdropFilter: 'blur(10px)'
    },
    position: { x: 0, y: 0 },
    size: { width: '100%', height: 'auto' }
  },

  // Hero Section
  {
    id: 'hero-title',
    type: 'header',
    content: {
      text: 'Designer Créatif',
      level: 1
    },
    styles: {
      color: '#ffffff',
      fontSize: '64px',
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: '20px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
    },
    position: { x: 0, y: 200 },
    size: { width: '100%', height: 'auto' }
  },
  {
    id: 'hero-subtitle',
    type: 'text',
    content: {
      text: 'Créateur d\'expériences visuelles uniques et mémorables'
    },
    styles: {
      color: '#ffffff',
      fontSize: '24px',
      textAlign: 'center',
      marginBottom: '40px',
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
    },
    position: { x: 0, y: 300 },
    size: { width: '100%', height: 'auto' }
  },
  {
    id: 'hero-cta',
    type: 'button',
    content: {
      text: 'Découvrir mon travail'
    },
    styles: {
      backgroundColor: '#8b5cf6',
      color: '#ffffff',
      fontSize: '18px',
      padding: '15px 40px',
      borderRadius: '50px',
      textAlign: 'center',
      display: 'block',
      margin: '0 auto',
      cursor: 'pointer',
      border: 'none',
      fontWeight: '600',
      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
      transition: 'all 0.3s ease'
    },
    position: { x: 0, y: 380 },
    size: { width: '250px', height: 'auto' }
  },

  // Portfolio Gallery
  {
    id: 'gallery',
    type: 'gallery',
    content: {
      images: [
        {
          src: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
          alt: 'Projet 1'
        },
        {
          src: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
          alt: 'Projet 2'
        },
        {
          src: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
          alt: 'Projet 3'
        },
        {
          src: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=600',
          alt: 'Projet 4'
        },
        {
          src: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
          alt: 'Projet 5'
        },
        {
          src: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=600',
          alt: 'Projet 6'
        }
      ],
      layout: 'grid',
      columns: 3,
      gap: '20px'
    },
    styles: {
      marginTop: '100px',
      marginBottom: '100px'
    },
    position: { x: 50, y: 500 },
    size: { width: '1200px', height: 'auto' }
  },

  // Services Section Title
  {
    id: 'services-title',
    type: 'header',
    content: {
      text: 'Mes Services',
      level: 2
    },
    styles: {
      color: '#1a1a1a',
      fontSize: '48px',
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: '60px'
    },
    position: { x: 0, y: 1000 },
    size: { width: '100%', height: 'auto' }
  },

  // Service 1 - Design Graphique
  {
    id: 'service-1-icon',
    type: 'icon',
    content: {
      icon: '🎨',
      size: 64,
      color: '#8b5cf6'
    },
    styles: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    position: { x: 100, y: 1100 },
    size: { width: '350px', height: 'auto' }
  },
  {
    id: 'service-1-title',
    type: 'header',
    content: {
      text: 'Design Graphique',
      level: 3
    },
    styles: {
      color: '#1a1a1a',
      fontSize: '28px',
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: '15px'
    },
    position: { x: 100, y: 1200 },
    size: { width: '350px', height: 'auto' }
  },
  {
    id: 'service-1-desc',
    type: 'text',
    content: {
      text: 'Création d\'identités visuelles, logos, et supports de communication percutants'
    },
    styles: {
      color: '#666666',
      fontSize: '16px',
      textAlign: 'center',
      lineHeight: '1.6'
    },
    position: { x: 100, y: 1260 },
    size: { width: '350px', height: 'auto' }
  },

  // Service 2 - UI/UX Design
  {
    id: 'service-2-icon',
    type: 'icon',
    content: {
      icon: '📱',
      size: 64,
      color: '#8b5cf6'
    },
    styles: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    position: { x: 500, y: 1100 },
    size: { width: '350px', height: 'auto' }
  },
  {
    id: 'service-2-title',
    type: 'header',
    content: {
      text: 'UI/UX Design',
      level: 3
    },
    styles: {
      color: '#1a1a1a',
      fontSize: '28px',
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: '15px'
    },
    position: { x: 500, y: 1200 },
    size: { width: '350px', height: 'auto' }
  },
  {
    id: 'service-2-desc',
    type: 'text',
    content: {
      text: 'Interfaces utilisateur intuitives et expériences digitales mémorables'
    },
    styles: {
      color: '#666666',
      fontSize: '16px',
      textAlign: 'center',
      lineHeight: '1.6'
    },
    position: { x: 500, y: 1260 },
    size: { width: '350px', height: 'auto' }
  },

  // Service 3 - Motion Design
  {
    id: 'service-3-icon',
    type: 'icon',
    content: {
      icon: '🎬',
      size: 64,
      color: '#8b5cf6'
    },
    styles: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    position: { x: 900, y: 1100 },
    size: { width: '350px', height: 'auto' }
  },
  {
    id: 'service-3-title',
    type: 'header',
    content: {
      text: 'Motion Design',
      level: 3
    },
    styles: {
      color: '#1a1a1a',
      fontSize: '28px',
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: '15px'
    },
    position: { x: 900, y: 1200 },
    size: { width: '350px', height: 'auto' }
  },
  {
    id: 'service-3-desc',
    type: 'text',
    content: {
      text: 'Animations et vidéos créatives pour captiver votre audience'
    },
    styles: {
      color: '#666666',
      fontSize: '16px',
      textAlign: 'center',
      lineHeight: '1.6'
    },
    position: { x: 900, y: 1260 },
    size: { width: '350px', height: 'auto' }
  },

  // Footer Section
  {
    id: 'footer-title',
    type: 'header',
    content: {
      text: 'Travaillons Ensemble',
      level: 3
    },
    styles: {
      color: '#ffffff',
      fontSize: '36px',
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: '20px'
    },
    position: { x: 0, y: 1500 },
    size: { width: '100%', height: 'auto' }
  },
  {
    id: 'footer-desc',
    type: 'text',
    content: {
      text: 'Prêt à donner vie à vos idées créatives ? Contactez-moi pour discuter de votre prochain projet.'
    },
    styles: {
      color: '#cccccc',
      fontSize: '18px',
      textAlign: 'center',
      marginBottom: '40px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    position: { x: 0, y: 1560 },
    size: { width: '100%', height: 'auto' }
  },

  // Social Icons
  {
    id: 'social-links',
    type: 'social',
    content: {
      platforms: [
        { name: 'Email', url: 'mailto:contact@creativestudio.com', icon: '📧' },
        { name: 'Phone', url: 'tel:+33123456789', icon: '📱' },
        { name: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
        { name: 'Behance', url: 'https://behance.net', icon: '🎨' }
      ]
    },
    styles: {
      marginBottom: '40px'
    },
    position: { x: 0, y: 1650 },
    size: { width: '100%', height: 'auto' }
  },

  // Copyright
  {
    id: 'copyright',
    type: 'text',
    content: {
      text: '© 2024 Creative Studio. Tous droits réservés.'
    },
    styles: {
      color: '#999999',
      fontSize: '14px',
      textAlign: 'center',
      marginBottom: '10px'
    },
    position: { x: 0, y: 1750 },
    size: { width: '100%', height: 'auto' }
  },
  {
    id: 'footer-note',
    type: 'text',
    content: {
      text: 'Fait avec ❤️ et beaucoup de ☕'
    },
    styles: {
      color: '#999999',
      fontSize: '12px',
      textAlign: 'center'
    },
    position: { x: 0, y: 1780 },
    size: { width: '100%', height: 'auto' }
  }
];
