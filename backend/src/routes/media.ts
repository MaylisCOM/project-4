import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../app';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom unique pour le fichier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

// Filtres pour les types de fichiers acceptés
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg|mp4|webm|ogg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// GET /api/media - Récupérer tous les médias d'un projet
router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const { projectId, type, folder } = req.query;

    const where: any = {};
    
    if (projectId) {
      // Vérifier que le projet appartient à l'utilisateur
      const project = await prisma.project.findFirst({
        where: { 
          id: projectId as string,
          userId: req.user.id 
        }
      });
      
      if (!project) {
        throw createError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND');
      }
      
      where.projectId = projectId;
    } else {
      // Si pas de projectId, récupérer tous les médias de l'utilisateur
      where.project = {
        userId: req.user.id
      };
    }

    if (type) {
      where.type = type;
    }

    if (folder) {
      where.folder = folder;
    }

    const media = await prisma.mediaItem.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      media,
      total: media.length
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/media/upload - Upload d'un fichier média
router.post('/upload', upload.single('file'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    if (!req.file) {
      throw createError('Aucun fichier fourni', 400, 'NO_FILE');
    }

    const { projectId, folder } = req.body;

    // Vérifier que le projet appartient à l'utilisateur si projectId fourni
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: { 
          id: projectId,
          userId: req.user.id 
        }
      });
      
      if (!project) {
        throw createError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND');
      }
    }

    // Déterminer le type de fichier
    const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';

    // Générer l'URL du fichier (à adapter selon votre configuration)
    const fileUrl = `/uploads/${req.file.filename}`;

    // Sauvegarder en base de données
    const mediaItem = await prisma.mediaItem.create({
      data: {
        name: req.file.originalname,
        url: fileUrl,
        type: fileType,
        size: req.file.size,
        folder: folder || null,
        projectId: projectId || null
      }
    });

    res.status(201).json({
      message: 'Fichier uploadé avec succès',
      media: mediaItem
    });

  } catch (error) {
    // Supprimer le fichier en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
});

// DELETE /api/media/:id - Supprimer un média
router.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    // Récupérer le média et vérifier les permissions
    const media = await prisma.mediaItem.findFirst({
      where: { 
        id: req.params.id,
        OR: [
          { projectId: null }, // Média global
          { 
            project: {
              userId: req.user.id
            }
          }
        ]
      }
    });

    if (!media) {
      throw createError('Média non trouvé', 404, 'MEDIA_NOT_FOUND');
    }

    // Supprimer le fichier physique
    const filePath = path.join(process.cwd(), 'uploads', path.basename(media.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer de la base de données
    await prisma.mediaItem.delete({
      where: { id: req.params.id }
    });

    res.json({
      message: 'Média supprimé avec succès'
    });

  } catch (error) {
    next(error);
  }
});

// PUT /api/media/:id - Mettre à jour un média
router.put('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Utilisateur non authentifié', 401, 'UNAUTHORIZED');
    }

    const { name, folder } = req.body;

    // Récupérer le média et vérifier les permissions
    const media = await prisma.mediaItem.findFirst({
      where: { 
        id: req.params.id,
        OR: [
          { projectId: null },
          { 
            project: {
              userId: req.user.id
            }
          }
        ]
      }
    });

    if (!media) {
      throw createError('Média non trouvé', 404, 'MEDIA_NOT_FOUND');
    }

    const updatedMedia = await prisma.mediaItem.update({
      where: { id: req.params.id },
      data: {
        name: name || media.name,
        folder: folder !== undefined ? folder : media.folder
      }
    });

    res.json({
      message: 'Média mis à jour avec succès',
      media: updatedMedia
    });

  } catch (error) {
    next(error);
  }
});

// Middleware pour servir les fichiers statiques
router.use('/files', express.static(path.join(process.cwd(), 'uploads')));

export default router;
