import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

// Interface pour les erreurs personnalisées
export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

// Middleware de gestion d'erreurs globales
export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Erreur capturée:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Erreur Prisma - Violation de contrainte unique
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Cette ressource existe déjà',
        code: 'DUPLICATE_RESOURCE',
        details: error.meta
      });
    }
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Ressource non trouvée',
        code: 'RESOURCE_NOT_FOUND',
        details: error.meta
      });
    }
  }

  // Erreur Prisma - Erreur de validation
  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: 'Données invalides',
      code: 'VALIDATION_ERROR',
      message: 'Les données fournies ne respectent pas le format attendu'
    });
  }

  // Erreur Prisma - Connexion à la base de données
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return res.status(500).json({
      error: 'Erreur de connexion à la base de données',
      code: 'DATABASE_CONNECTION_ERROR'
    });
  }

  // Erreur JSON malformé
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      error: 'Format JSON invalide',
      code: 'INVALID_JSON'
    });
  }

  // Erreur personnalisée avec statusCode
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code || 'CUSTOM_ERROR'
    });
  }

  // Erreur par défaut
  return res.status(500).json({
    error: 'Erreur interne du serveur',
    code: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// Fonction utilitaire pour créer des erreurs personnalisées
export const createError = (message: string, statusCode: number, code?: string): CustomError => {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

// Middleware pour gérer les routes non trouvées
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} non trouvée`,
    code: 'ROUTE_NOT_FOUND'
  });
};
