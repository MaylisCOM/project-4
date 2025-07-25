import express from 'express';
import { prisma } from '../app';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { AccessibilityService, AccessibilityIssue, ComponentData } from '../services/accessibilityService';

const router = express.Router();

// GET /api/projects/:id/accessibility/audit - Analyser l'accessibilité d'un projet
router.get('/:projectId/audit', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const { projectId } = req.params;

    // Vérifier que le projet appartient à l'utilisateur
    const project = await prisma.project.findFirst({
      where: { 
        id: projectId,
        userId: req.user.id 
      },
      include: {
        components: true,
        pages: {
          include: {
            components: true
          }
        }
      }
    });

    if (!project) {
      throw createError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND');
    }

    // Récupérer tous les composants du projet (projet + pages)
    const allComponents: ComponentData[] = [];
    
    // Composants du projet
    project.components.forEach(comp => {
      allComponents.push({
        id: comp.id,
        type: comp.type,
        content: comp.content,
        styles: comp.styles,
        width: comp.width,
        height: comp.height,
        seoAlt: comp.seoAlt || undefined,
        ariaLabel: comp.ariaLabel || undefined,
        role: comp.role || undefined,
        tabIndex: comp.tabIndex || undefined
      });
    });

    // Composants des pages
    project.pages.forEach(page => {
      page.components.forEach(comp => {
        allComponents.push({
          id: comp.id,
          type: comp.type,
          content: comp.content,
          styles: comp.styles,
          width: comp.width,
          height: comp.height,
          seoAlt: comp.seoAlt || undefined,
          ariaLabel: comp.ariaLabel || undefined,
          role: comp.role || undefined,
          tabIndex: comp.tabIndex || undefined
        });
      });
    });

    // Analyser l'accessibilité
    const report = AccessibilityService.analyzeProject(allComponents);

    // Mettre à jour le score d'accessibilité du projet
    await prisma.project.update({
      where: { id: projectId },
      data: { 
        accessibilityScore: report.score,
        updatedAt: new Date()
      }
    });

    res.json({
      report,
      projectId,
      analyzedAt: new Date(),
      componentCount: allComponents.length
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id/accessibility/component/:componentId - Analyser un composant spécifique
router.get('/:projectId/component/:componentId', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const { projectId, componentId } = req.params;

    // Vérifier que le projet appartient à l'utilisateur
    const project = await prisma.project.findFirst({
      where: { 
        id: projectId,
        userId: req.user.id 
      }
    });

    if (!project) {
      throw createError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND');
    }

    // Récupérer le composant
    const component = await prisma.component.findFirst({
      where: {
        id: componentId,
        OR: [
          { projectId: projectId },
          { page: { projectId: projectId } }
        ]
      }
    });

    if (!component) {
      throw createError('Composant non trouvé', 404, 'COMPONENT_NOT_FOUND');
    }

    const componentData: ComponentData = {
      id: component.id,
      type: component.type,
      content: component.content,
      styles: component.styles,
      width: component.width,
      height: component.height,
      seoAlt: component.seoAlt || undefined,
      ariaLabel: component.ariaLabel || undefined,
      role: component.role || undefined,
      tabIndex: component.tabIndex || undefined
    };

    // Analyser le composant
    const analysis = AccessibilityService.analyzeComponent(componentData);

    res.json({
      analysis,
      componentId,
      analyzedAt: new Date()
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:id/accessibility/fix - Appliquer des corrections automatiques
router.post('/:projectId/fix', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const { projectId } = req.params;
    const { issues }: { issues: AccessibilityIssue[] } = req.body;

    if (!issues || !Array.isArray(issues)) {
      throw createError('Liste des problèmes requise', 400, 'MISSING_ISSUES');
    }

    // Vérifier que le projet appartient à l'utilisateur
    const project = await prisma.project.findFirst({
      where: { 
        id: projectId,
        userId: req.user.id 
      }
    });

    if (!project) {
      throw createError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND');
    }

    const fixedIssues: Array<{ issue: AccessibilityIssue; componentId: string; fixes: Record<string, unknown> }> = [];

    // Traiter chaque problème
    for (const issue of issues) {
      if (!issue.componentId) continue;

      // Récupérer le composant
      const component = await prisma.component.findFirst({
        where: {
          id: issue.componentId,
          OR: [
            { projectId: projectId },
            { page: { projectId: projectId } }
          ]
        }
      });

      if (!component) continue;

      const componentData: ComponentData = {
        id: component.id,
        type: component.type,
        content: component.content,
        styles: component.styles,
        width: component.width,
        height: component.height,
        seoAlt: component.seoAlt || undefined,
        ariaLabel: component.ariaLabel || undefined,
        role: component.role || undefined,
        tabIndex: component.tabIndex || undefined
      };

      // Générer les corrections
      const fixes = AccessibilityService.generateAutomaticFixes(issue, componentData);

      if (Object.keys(fixes).length > 0) {
        // Appliquer les corrections
        const updateData: Record<string, unknown> = {};
        
        if (fixes.seoAlt) updateData.seoAlt = fixes.seoAlt;
        if (fixes.ariaLabel) updateData.ariaLabel = fixes.ariaLabel;
        if (fixes.tabIndex !== undefined) updateData.tabIndex = fixes.tabIndex;

        if (Object.keys(updateData).length > 0) {
          await prisma.component.update({
            where: { id: component.id },
            data: {
              ...updateData,
              updatedAt: new Date()
            }
          });

          fixedIssues.push({
            issue,
            componentId: component.id,
            fixes
          });
        }
      }
    }

    // Mettre à jour la date de modification du projet
    await prisma.project.update({
      where: { id: projectId },
      data: { updatedAt: new Date() }
    });

    res.json({
      message: `${fixedIssues.length} problème(s) corrigé(s) automatiquement`,
      fixedIssues,
      projectId
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id/accessibility/settings - Récupérer les paramètres d'accessibilité
router.get('/:projectId/settings', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const { projectId } = req.params;

    // Vérifier que le projet appartient à l'utilisateur
    const project = await prisma.project.findFirst({
      where: { 
        id: projectId,
        userId: req.user.id 
      }
    });

    if (!project) {
      throw createError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND');
    }

    // Pour l'instant, on retourne des paramètres par défaut
    // Dans une version future, on pourrait stocker ces paramètres en base
    const settings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: true,
      keyboardNavigation: true,
      autoFix: false,
      realTimeAnalysis: true
    };

    res.json({
      settings,
      projectId
    });

  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id/accessibility/settings - Mettre à jour les paramètres d'accessibilité
router.put('/:projectId/settings', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const { projectId } = req.params;
    const { settings } = req.body;

    if (!settings) {
      throw createError('Paramètres requis', 400, 'MISSING_SETTINGS');
    }

    // Vérifier que le projet appartient à l'utilisateur
    const project = await prisma.project.findFirst({
      where: { 
        id: projectId,
        userId: req.user.id 
      }
    });

    if (!project) {
      throw createError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND');
    }

    // Pour l'instant, on simule la sauvegarde des paramètres
    // Dans une version future, on pourrait les stocker en base
    
    res.json({
      message: 'Paramètres d\'accessibilité mis à jour',
      settings,
      projectId
    });

  } catch (error) {
    next(error);
  }
});

export default router;
