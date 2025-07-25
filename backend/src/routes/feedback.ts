import express from 'express';
import { prisma } from '../app';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Interface pour les données de feedback
interface FeedbackData {
  type: 'bug' | 'feature' | 'improvement' | 'question';
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

// Interface pour les données de réponse
interface ResponseData {
  message: string;
  isOfficial?: boolean;
}

// GET /api/feedback - Récupérer tous les feedbacks
router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { 
      status, 
      type, 
      priority, 
      userId, 
      limit = '20', 
      offset = '0',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Construction des filtres
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (priority) {
      where.priority = priority;
    }
    
    if (userId) {
      where.userId = userId;
    }

    const feedbacks = await prisma.feedbackItem.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        responses: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: {
            responses: true
          }
        }
      },
      orderBy: {
        [sortBy as string]: sortOrder
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    const total = await prisma.feedbackItem.count({ where });

    res.json({
      feedbacks,
      total,
      hasMore: parseInt(offset as string) + feedbacks.length < total
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/feedback/:id - Récupérer un feedback spécifique
router.get('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const feedback = await prisma.feedbackItem.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        responses: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!feedback) {
      throw createError('Feedback non trouvé', 404, 'FEEDBACK_NOT_FOUND');
    }

    res.json(feedback);

  } catch (error) {
    next(error);
  }
});

// POST /api/feedback - Créer un nouveau feedback
router.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const feedbackData: FeedbackData = req.body;

    // Validation des données
    if (!feedbackData.type || !feedbackData.title || !feedbackData.description) {
      throw createError('Type, titre et description requis', 400, 'MISSING_FIELDS');
    }

    const validTypes = ['bug', 'feature', 'improvement', 'question'];
    if (!validTypes.includes(feedbackData.type)) {
      throw createError('Type de feedback invalide', 400, 'INVALID_TYPE');
    }

    const validPriorities = ['low', 'medium', 'high', 'critical'];
    if (feedbackData.priority && !validPriorities.includes(feedbackData.priority)) {
      throw createError('Priorité invalide', 400, 'INVALID_PRIORITY');
    }

    const feedback = await prisma.feedbackItem.create({
      data: {
        type: feedbackData.type,
        title: feedbackData.title,
        description: feedbackData.description,
        priority: feedbackData.priority || 'medium',
        userId: req.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Feedback créé avec succès',
      feedback
    });

  } catch (error) {
    next(error);
  }
});

// PUT /api/feedback/:id - Mettre à jour un feedback
router.put('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const { status, priority } = req.body;

    // Vérifier que le feedback existe
    const existingFeedback = await prisma.feedbackItem.findUnique({
      where: { id: req.params.id }
    });

    if (!existingFeedback) {
      throw createError('Feedback non trouvé', 404, 'FEEDBACK_NOT_FOUND');
    }

    // Seul le créateur peut modifier son feedback (sauf pour le statut)
    if (existingFeedback.userId !== req.user.id && status === undefined) {
      throw createError('Non autorisé à modifier ce feedback', 403, 'FORBIDDEN');
    }

    const updateData: any = {};
    
    if (status) {
      const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
      if (!validStatuses.includes(status)) {
        throw createError('Statut invalide', 400, 'INVALID_STATUS');
      }
      updateData.status = status;
    }
    
    if (priority) {
      const validPriorities = ['low', 'medium', 'high', 'critical'];
      if (!validPriorities.includes(priority)) {
        throw createError('Priorité invalide', 400, 'INVALID_PRIORITY');
      }
      updateData.priority = priority;
    }

    const updatedFeedback = await prisma.feedbackItem.update({
      where: { id: req.params.id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    res.json({
      message: 'Feedback mis à jour avec succès',
      feedback: updatedFeedback
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/feedback/:id/vote - Voter pour un feedback
router.post('/:id/vote', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const { direction } = req.body; // 'up' ou 'down'

    if (!direction || !['up', 'down'].includes(direction)) {
      throw createError('Direction de vote invalide', 400, 'INVALID_VOTE_DIRECTION');
    }

    const feedback = await prisma.feedbackItem.findUnique({
      where: { id: req.params.id }
    });

    if (!feedback) {
      throw createError('Feedback non trouvé', 404, 'FEEDBACK_NOT_FOUND');
    }

    // Incrémenter ou décrémenter les votes
    const increment = direction === 'up' ? 1 : -1;

    const updatedFeedback = await prisma.feedbackItem.update({
      where: { id: req.params.id },
      data: {
        votes: {
          increment
        }
      }
    });

    res.json({
      message: 'Vote enregistré',
      votes: updatedFeedback.votes
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/feedback/:id/responses - Ajouter une réponse à un feedback
router.post('/:id/responses', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const responseData: ResponseData = req.body;

    if (!responseData.message) {
      throw createError('Message requis', 400, 'MISSING_MESSAGE');
    }

    // Vérifier que le feedback existe
    const feedback = await prisma.feedbackItem.findUnique({
      where: { id: req.params.id }
    });

    if (!feedback) {
      throw createError('Feedback non trouvé', 404, 'FEEDBACK_NOT_FOUND');
    }

    const response = await prisma.feedbackResponse.create({
      data: {
        message: responseData.message,
        isOfficial: responseData.isOfficial || false,
        userId: req.user.id,
        feedbackId: req.params.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Réponse ajoutée avec succès',
      response
    });

  } catch (error) {
    next(error);
  }
});

// DELETE /api/feedback/:id - Supprimer un feedback
router.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    // Vérifier que le feedback appartient à l'utilisateur
    const feedback = await prisma.feedbackItem.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!feedback) {
      throw createError('Feedback non trouvé ou non autorisé', 404, 'FEEDBACK_NOT_FOUND');
    }

    await prisma.feedbackItem.delete({
      where: { id: req.params.id }
    });

    res.json({
      message: 'Feedback supprimé avec succès'
    });

  } catch (error) {
    next(error);
  }
});

export default router;
