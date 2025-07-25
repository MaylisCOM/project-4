import { Template, Project } from '../types';

export const mockTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Business Pro',
    description: 'Template professionnel pour entreprises avec sections complètes',
    thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'business',
    isPremium: true,
    price: 29,
    author: 'WebUIZ Team',
    rating: 4.8,
    downloads: 1234,
    components: [
      {
        id: 'hero-1',
        type: 'hero',
        content: {
          title: 'Développez votre business avec style',
          subtitle: 'Une solution complète pour présenter votre entreprise de manière professionnelle',
          buttonText: 'Découvrir nos services',
          backgroundImage: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920'
        },
        styles: {
          padding: '6rem 2rem',
          textAlign: 'center' as const,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white'
        },
        position: { x: 0, y: 0 },
        size: { width: '100%', height: 'auto' }
      },
      {
        id: 'features-1',
        type: 'feature-grid',
        content: {
          features: [
            { title: 'Innovation', description: 'Technologies de pointe pour votre croissance', icon: '🚀' },
            { title: 'Fiabilité', description: 'Des solutions robustes et éprouvées', icon: '🛡️' },
            { title: 'Support', description: 'Accompagnement personnalisé 24/7', icon: '💬' },
          ]
        },
        styles: {
          padding: '4rem 2rem',
          backgroundColor: '#f8fafc'
        },
        position: { x: 0, y: 400 },
        size: { width: '100%', height: 'auto' }
      }
    ]
  },
  {
    id: 'template-2',
    name: 'Portfolio Creative',
    description: 'Showcase créatif pour artistes et designers',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'portfolio',
    isPremium: false,
    author: 'Sarah Johnson',
    rating: 4.6,
    downloads: 856,
    components: [
      {
        id: 'hero-2',
        type: 'hero',
        content: {
          title: 'Portfolio Créatif',
          subtitle: 'Découvrez mes créations et mon univers artistique',
          buttonText: 'Voir mes œuvres',
          backgroundImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1920'
        },
        styles: {
          padding: '5rem 2rem',
          textAlign: 'center' as const,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white'
        },
        position: { x: 0, y: 0 },
        size: { width: '100%', height: 'auto' }
      }
    ]
  },
  {
    id: 'template-3',
    name: 'Landing Page Conversion',
    description: 'Page de conversion optimisée pour maximiser vos ventes',
    thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'landing',
    isPremium: true,
    price: 39,
    author: 'Marc Dubois',
    rating: 4.9,
    downloads: 642,
    components: [
      {
        id: 'hero-3',
        type: 'hero',
        content: {
          title: 'Augmentez vos conversions de 300%',
          subtitle: 'La solution marketing qui transforme vos visiteurs en clients',
          buttonText: 'Commencer maintenant',
          backgroundImage: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1920'
        },
        styles: {
          padding: '5rem 2rem',
          textAlign: 'center' as const,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white'
        },
        position: { x: 0, y: 0 },
        size: { width: '100%', height: 'auto' }
      }
    ]
  }
];

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Mon premier site',
    components: [],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
    isPublished: false,
    template: mockTemplates[0]
  },
  {
    id: 'project-2',
    name: 'Portfolio personnel',
    components: [],
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-16'),
    isPublished: true,
    url: 'https://mon-portfolio.webuiz.com',
    template: mockTemplates[1]
  }
];