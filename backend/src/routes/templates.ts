import express from 'express';
import { prisma } from '../app';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Interface pour les données de template
interface TemplateData {
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  isPremium?: boolean;
  price?: number;
  author: string;
  components: any[];
}

// GET /api/templates - Récupérer tous les templates
router.get('/', async (req, res, next) => {
  try {
    const { category, isPremium, search, limit = '20', offset = '0' } = req.query;

    // Construction des filtres
    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (isPremium !== undefined) {
      where.isPremium = isPremium === 'true';
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { author: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: [
        { isPremium: 'desc' },
        { rating: 'desc' },
        { downloads: 'desc' }
      ],
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    const total = await prisma.template.count({ where });

    // Transformation des données
    const transformedTemplates = templates.map(template => ({
      ...template,
      components: JSON.parse(template.components)
    }));

    res.json({
      templates: transformedTemplates,
      total,
      hasMore: parseInt(offset as string) + templates.length < total
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/templates/:id - Récupérer un template spécifique
router.get('/:id', async (req, res, next) => {
  try {
    const template = await prisma.template.findUnique({
      where: { id: req.params.id }
    });

    if (!template) {
      throw createError('Template non trouvé', 404, 'TEMPLATE_NOT_FOUND');
    }

    // Transformation des données
    const transformedTemplate = {
      ...template,
      components: JSON.parse(template.components)
    };

    res.json(transformedTemplate);

  } catch (error) {
    next(error);
  }
});

// GET /api/templates/categories - Récupérer les catégories disponibles
router.get('/meta/categories', async (req, res, next) => {
  try {
    const categories = await prisma.template.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    });

    const formattedCategories = categories.map(cat => ({
      name: cat.category,
      count: cat._count.category,
      label: getCategoryLabel(cat.category)
    }));

    res.json({
      categories: formattedCategories
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/templates/:id/download - Incrémenter le compteur de téléchargements
router.post('/:id/download', async (req, res, next) => {
  try {
    const template = await prisma.template.findUnique({
      where: { id: req.params.id }
    });

    if (!template) {
      throw createError('Template non trouvé', 404, 'TEMPLATE_NOT_FOUND');
    }

    await prisma.template.update({
      where: { id: req.params.id },
      data: {
        downloads: {
          increment: 1
        }
      }
    });

    res.json({
      message: 'Téléchargement enregistré'
    });

  } catch (error) {
    next(error);
  }
});

// Fonction utilitaire pour les labels de catégories
function getCategoryLabel(category: string): string {
  const labels: { [key: string]: string } = {
    'business': 'Business',
    'portfolio': 'Portfolio',
    'landing': 'Landing Page',
    'blog': 'Blog',
    'ecommerce': 'E-commerce'
  };
  
  return labels[category] || category;
}

export default router;
