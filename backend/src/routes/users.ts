import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../app';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Interface pour les données de mise à jour du profil
interface ProfileUpdateData {
  name?: string;
  avatar?: string;
  language?: string;
  theme?: 'light' | 'dark';
  notifications?: boolean;
}

// Interface pour le changement de mot de passe
interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// GET /api/users/profile - Récupérer le profil de l'utilisateur connecté
router.get('/profile', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        language: true,
        theme: true,
        notifications: true,
        _count: {
          select: {
            projects: true,
            feedback: true
          }
        }
      }
    });

    if (!user) {
      throw createError('Utilisateur non trouvé', 404, 'USER_NOT_FOUND');
    }

    res.json({
      user: {
        ...user,
        preferences: {
          language: user.language,
          theme: user.theme,
          notifications: user.notifications
        },
        stats: {
          projectsCount: user._count.projects,
          feedbackCount: user._count.feedback
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// PUT /api/users/profile - Mettre à jour le profil
router.put('/profile', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const updateData: ProfileUpdateData = req.body;

    // Validation des données
    if (updateData.theme && !['light', 'dark'].includes(updateData.theme)) {
      throw createError('Thème invalide', 400, 'INVALID_THEME');
    }

    if (updateData.language && !/^[a-z]{2}$/.test(updateData.language)) {
      throw createError('Code de langue invalide', 400, 'INVALID_LANGUAGE');
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: updateData.name,
        avatar: updateData.avatar,
        language: updateData.language,
        theme: updateData.theme,
        notifications: updateData.notifications,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        language: true,
        theme: true,
        notifications: true
      }
    });

    res.json({
      message: 'Profil mis à jour avec succès',
      user: {
        ...updatedUser,
        preferences: {
          language: updatedUser.language,
          theme: updatedUser.theme,
          notifications: updatedUser.notifications
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// PUT /api/users/password - Changer le mot de passe
router.put('/password', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const { currentPassword, newPassword }: PasswordChangeData = req.body;

    // Validation des données
    if (!currentPassword || !newPassword) {
      throw createError('Mot de passe actuel et nouveau mot de passe requis', 400, 'MISSING_PASSWORDS');
    }

    if (newPassword.length < 6) {
      throw createError('Le nouveau mot de passe doit contenir au moins 6 caractères', 400, 'PASSWORD_TOO_SHORT');
    }

    // Récupérer l'utilisateur avec le mot de passe
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      throw createError('Utilisateur non trouvé', 404, 'USER_NOT_FOUND');
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw createError('Mot de passe actuel incorrect', 401, 'INVALID_CURRENT_PASSWORD');
    }

    // Hacher le nouveau mot de passe
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    });

    res.json({
      message: 'Mot de passe mis à jour avec succès'
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/users/stats - Récupérer les statistiques de l'utilisateur
router.get('/stats', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    // Statistiques des projets
    const projectStats = await prisma.project.groupBy({
      by: ['isPublished'],
      where: { userId: req.user.id },
      _count: {
        id: true
      }
    });

    // Statistiques des feedbacks
    const feedbackStats = await prisma.feedbackItem.groupBy({
      by: ['type', 'status'],
      where: { userId: req.user.id },
      _count: {
        id: true
      }
    });

    // Projets récents
    const recentProjects = await prisma.project.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        name: true,
        updatedAt: true,
        isPublished: true
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    });

    // Activité récente (derniers feedbacks)
    const recentActivity = await prisma.feedbackItem.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const stats = {
      projects: {
        total: projectStats.reduce((sum, stat) => sum + stat._count.id, 0),
        published: projectStats.find(stat => stat.isPublished)?._count.id || 0,
        draft: projectStats.find(stat => !stat.isPublished)?._count.id || 0
      },
      feedback: {
        total: feedbackStats.reduce((sum, stat) => sum + stat._count.id, 0),
        byType: feedbackStats.reduce((acc, stat) => {
          acc[stat.type] = (acc[stat.type] || 0) + stat._count.id;
          return acc;
        }, {} as Record<string, number>),
        byStatus: feedbackStats.reduce((acc, stat) => {
          acc[stat.status] = (acc[stat.status] || 0) + stat._count.id;
          return acc;
        }, {} as Record<string, number>)
      },
      recentProjects,
      recentActivity
    };

    res.json(stats);

  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/account - Supprimer le compte utilisateur
router.delete('/account', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const { password } = req.body;

    if (!password) {
      throw createError('Mot de passe requis pour supprimer le compte', 400, 'PASSWORD_REQUIRED');
    }

    // Récupérer l'utilisateur avec le mot de passe
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      throw createError('Utilisateur non trouvé', 404, 'USER_NOT_FOUND');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError('Mot de passe incorrect', 401, 'INVALID_PASSWORD');
    }

    // Supprimer l'utilisateur (cascade supprimera automatiquement les projets, etc.)
    await prisma.user.delete({
      where: { id: req.user.id }
    });

    res.json({
      message: 'Compte supprimé avec succès'
    });

  } catch (error) {
    next(error);
  }
});

export default router;
