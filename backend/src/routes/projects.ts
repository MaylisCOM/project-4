import express from 'express';
import { prisma } from '../app';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Interface pour les données de projet
interface ProjectData {
  name: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoLanguage?: string;
  seoRobots?: string;
  languages?: string[];
  currentLanguage?: string;
  logo?: string;
  favicon?: string;
  companyName?: string;
}

// Interface pour les données de page (correspondant au frontend)
interface SavePageData {
  id: string;
  name: string;
  slug: string;
  isHomePage?: boolean;
  components: SaveComponentData[];
  seoSettings?: {
    title?: string;
    description?: string;
    keywords?: string[];
    customMeta?: Record<string, string>;
  };
}

// Interface pour les données de composant (correspondant au frontend)
interface SaveComponentData {
  id: string;
  type: string;
  content: Record<string, unknown>;
  styles: Record<string, unknown>;
  position: { x: number; y: number };
  size: { width: string; height: string };
  responsivePosition?: Record<string, unknown>;
  responsiveSize?: Record<string, unknown>;
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

// Interface pour la sauvegarde d'état
interface SaveStateData {
  components: SaveComponentData[];
  pages: SavePageData[];
}

// GET /api/projects - Récupérer tous les projets de l'utilisateur
router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      include: {
        pages: {
          include: {
            components: true
          }
        },
        media: true,
        _count: {
          select: {
            pages: true,
            components: true,
            media: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Transformation des données pour le frontend
    const transformedProjects = projects.map(project => ({
      ...project,
      seoSettings: {
        title: project.seoTitle,
        description: project.seoDescription,
        keywords: project.seoKeywords ? JSON.parse(project.seoKeywords) : [],
        language: project.seoLanguage,
        robots: project.seoRobots
      },
      languages: project.languages ? JSON.parse(project.languages) : ['fr'],
      branding: {
        logo: project.logo,
        favicon: project.favicon,
        companyName: project.companyName
      },
      performanceMetrics: {
        loadTime: project.loadTime,
        seoScore: project.seoScore,
        accessibilityScore: project.accessibilityScore,
        mobileScore: project.mobileScore
      }
    }));

    res.json({
      projects: transformedProjects,
      total: projects.length
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id - Récupérer un projet spécifique
router.get('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const project = await prisma.project.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: {
        pages: {
          include: {
            components: {
              orderBy: { layer: 'asc' }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        media: {
          orderBy: { uploadedAt: 'desc' }
        }
      }
    });

    if (!project) {
      throw createError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND');
    }

    // Transformation des données
    const transformedProject = {
      ...project,
      seoSettings: {
        title: project.seoTitle,
        description: project.seoDescription,
        keywords: project.seoKeywords ? JSON.parse(project.seoKeywords) : [],
        language: project.seoLanguage,
        robots: project.seoRobots
      },
      languages: project.languages ? JSON.parse(project.languages) : ['fr'],
      branding: {
        logo: project.logo,
        favicon: project.favicon,
        companyName: project.companyName
      },
      performanceMetrics: {
        loadTime: project.loadTime,
        seoScore: project.seoScore,
        accessibilityScore: project.accessibilityScore,
        mobileScore: project.mobileScore
      },
      pages: project.pages.map(page => ({
        ...page,
        seoSettings: {
          title: page.seoTitle,
          description: page.seoDescription,
          keywords: page.seoKeywords ? JSON.parse(page.seoKeywords) : [],
          customMeta: page.customMeta ? JSON.parse(page.customMeta) : {}
        },
        components: page.components.map(component => ({
          ...component,
          content: JSON.parse(component.content),
          styles: JSON.parse(component.styles),
          position: { x: component.positionX, y: component.positionY },
          size: { width: component.width, height: component.height },
          responsivePosition: component.responsivePosition ? JSON.parse(component.responsivePosition) : undefined,
          responsiveSize: component.responsiveSize ? JSON.parse(component.responsiveSize) : undefined,
          seo: {
            alt: component.seoAlt,
            title: component.seoTitle,
            description: component.seoDescription,
            keywords: component.seoKeywords ? JSON.parse(component.seoKeywords) : []
          },
          accessibility: {
            ariaLabel: component.ariaLabel,
            role: component.role,
            tabIndex: component.tabIndex
          }
        }))
      }))
    };

    res.json(transformedProject);

  } catch (error) {
    next(error);
  }
});

// POST /api/projects - Créer un nouveau projet
router.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const projectData: ProjectData = req.body;

    if (!projectData.name) {
      throw createError('Le nom du projet est requis', 400, 'MISSING_PROJECT_NAME');
    }

    const project = await prisma.project.create({
      data: {
        name: projectData.name,
        userId: req.user.id,
        seoTitle: projectData.seoTitle,
        seoDescription: projectData.seoDescription,
        seoKeywords: projectData.seoKeywords ? JSON.stringify(projectData.seoKeywords) : null,
        seoLanguage: projectData.seoLanguage || 'fr',
        seoRobots: projectData.seoRobots || 'index, follow',
        languages: JSON.stringify(projectData.languages || ['fr']),
        currentLanguage: projectData.currentLanguage || 'fr',
        logo: projectData.logo,
        favicon: projectData.favicon,
        companyName: projectData.companyName,
        pages: {
          create: {
            name: 'Accueil',
            slug: '',
            isHomePage: true
          }
        }
      },
      include: {
        pages: true
      }
    });

    res.status(201).json({
      message: 'Projet créé avec succès',
      project
    });

  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id - Mettre à jour un projet
router.put('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const projectData: Partial<ProjectData> = req.body;

    // Vérifier que le projet appartient à l'utilisateur
    const existingProject = await prisma.project.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!existingProject) {
      throw createError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND');
    }

    const updatedProject = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        name: projectData.name,
        seoTitle: projectData.seoTitle,
        seoDescription: projectData.seoDescription,
        seoKeywords: projectData.seoKeywords ? JSON.stringify(projectData.seoKeywords) : undefined,
        seoLanguage: projectData.seoLanguage,
        seoRobots: projectData.seoRobots,
        languages: projectData.languages ? JSON.stringify(projectData.languages) : undefined,
        currentLanguage: projectData.currentLanguage,
        logo: projectData.logo,
        favicon: projectData.favicon,
        companyName: projectData.companyName,
        updatedAt: new Date()
      }
    });

    res.json({
      message: 'Projet mis à jour avec succès',
      project: updatedProject
    });

  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id - Supprimer un projet
router.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    // Vérifier que le projet appartient à l'utilisateur
    const existingProject = await prisma.project.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!existingProject) {
      throw createError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND');
    }

    await prisma.project.delete({
      where: { id: req.params.id }
    });

    res.json({
      message: 'Projet supprimé avec succès'
    });

  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id/state - Sauvegarder l'état complet du projet
router.put('/:id/state', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const { components, pages }: SaveStateData = req.body;

    // Vérifier que le projet appartient à l'utilisateur
    const existingProject = await prisma.project.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!existingProject) {
      throw createError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND');
    }

    // Utiliser une transaction pour s'assurer que toutes les opérations réussissent
    await prisma.$transaction(async (tx) => {
      // Mettre à jour le projet
      await tx.project.update({
        where: { id: req.params.id },
        data: {
          updatedAt: new Date()
        }
      });

      // Supprimer tous les composants existants
      await tx.component.deleteMany({
        where: { projectId: req.params.id }
      });

      // Supprimer toutes les pages existantes (sauf la page d'accueil)
      await tx.page.deleteMany({
        where: { 
          projectId: req.params.id,
          isHomePage: false
        }
      });

      // Recréer les pages
      if (pages && pages.length > 0) {
        for (const page of pages) {
          const createdPage = await tx.page.upsert({
            where: {
              projectId_slug: {
                projectId: req.params.id,
                slug: page.slug
              }
            },
            update: {
              name: page.name,
              seoTitle: page.seoSettings?.title,
              seoDescription: page.seoSettings?.description,
              seoKeywords: page.seoSettings?.keywords ? JSON.stringify(page.seoSettings.keywords) : null,
              customMeta: page.seoSettings?.customMeta ? JSON.stringify(page.seoSettings.customMeta) : null,
              updatedAt: new Date()
            },
            create: {
              id: page.id,
              name: page.name,
              slug: page.slug,
              isHomePage: page.isHomePage || false,
              projectId: req.params.id,
              seoTitle: page.seoSettings?.title,
              seoDescription: page.seoSettings?.description,
              seoKeywords: page.seoSettings?.keywords ? JSON.stringify(page.seoSettings.keywords) : null,
              customMeta: page.seoSettings?.customMeta ? JSON.stringify(page.seoSettings.customMeta) : null
            }
          });

          // Créer les composants de cette page
          if (page.components && page.components.length > 0) {
            for (const component of page.components) {
              await tx.component.create({
                data: {
                  id: component.id,
                  type: component.type,
                  content: JSON.stringify(component.content),
                  styles: JSON.stringify(component.styles),
                  positionX: component.position.x,
                  positionY: component.position.y,
                  width: component.size.width,
                  height: component.size.height,
                  responsivePosition: component.responsivePosition ? JSON.stringify(component.responsivePosition) : null,
                  responsiveSize: component.responsiveSize ? JSON.stringify(component.responsiveSize) : null,
                  locked: component.locked || false,
                  visible: component.visible !== false,
                  layer: component.layer || 0,
                  seoAlt: component.seo?.alt,
                  seoTitle: component.seo?.title,
                  seoDescription: component.seo?.description,
                  seoKeywords: component.seo?.keywords ? JSON.stringify(component.seo.keywords) : null,
                  ariaLabel: component.accessibility?.ariaLabel,
                  role: component.accessibility?.role,
                  tabIndex: component.accessibility?.tabIndex,
                  projectId: req.params.id,
                  pageId: createdPage.id
                }
              });
            }
          }
        }
      }

      // Créer les composants globaux (non liés à une page spécifique)
      if (components && components.length > 0) {
        for (const component of components) {
          // Vérifier si le composant n'est pas déjà créé via une page
          const existsInPage = pages?.some(page => 
            page.components?.some(pageComp => pageComp.id === component.id)
          );

          if (!existsInPage) {
            await tx.component.create({
              data: {
                id: component.id,
                type: component.type,
                content: JSON.stringify(component.content),
                styles: JSON.stringify(component.styles),
                positionX: component.position.x,
                positionY: component.position.y,
                width: component.size.width,
                height: component.size.height,
                responsivePosition: component.responsivePosition ? JSON.stringify(component.responsivePosition) : null,
                responsiveSize: component.responsiveSize ? JSON.stringify(component.responsiveSize) : null,
                locked: component.locked || false,
                visible: component.visible !== false,
                layer: component.layer || 0,
                seoAlt: component.seo?.alt,
                seoTitle: component.seo?.title,
                seoDescription: component.seo?.description,
                seoKeywords: component.seo?.keywords ? JSON.stringify(component.seo.keywords) : null,
                ariaLabel: component.accessibility?.ariaLabel,
                role: component.accessibility?.role,
                tabIndex: component.accessibility?.tabIndex,
                projectId: req.params.id,
                pageId: null
              }
            });
          }
        }
      }
    });

    res.json({
      message: 'Projet sauvegardé avec succès'
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:id/publish - Publier un projet
router.post('/:id/publish', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    // Vérifier que le projet appartient à l'utilisateur
    const existingProject = await prisma.project.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!existingProject) {
      throw createError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND');
    }

    const publishedProject = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        isPublished: true,
        url: `https://${existingProject.name.toLowerCase().replace(/\s+/g, '-')}.webuiz.com`,
        updatedAt: new Date()
      }
    });

    res.json({
      message: 'Projet publié avec succès',
      project: publishedProject
    });

  } catch (error) {
    next(error);
  }
});

export default router;
