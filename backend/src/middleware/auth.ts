import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';

// Interface pour étendre Request avec user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// Middleware d'authentification JWT
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupération du token depuis l'header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ 
        error: 'Token d\'accès requis',
        code: 'NO_TOKEN'
      });
    }

    // Vérification du token JWT
    const jwtSecret = process.env.JWT_SECRET || 'votre-secret-jwt-super-securise';
    const decoded = jwt.verify(token, jwtSecret) as { 
      userId: string; 
      email: string; 
      name: string; 
    };

    // Vérification que l'utilisateur existe toujours en base
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    // Ajout des informations utilisateur à la requête
    req.user = user;
    next();

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        error: 'Token invalide',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        error: 'Token expiré',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(500).json({ 
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Middleware optionnel d'authentification (n'échoue pas si pas de token)
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Pas de token, on continue sans user
    }

    const jwtSecret = process.env.JWT_SECRET || 'votre-secret-jwt-super-securise';
    const decoded = jwt.verify(token, jwtSecret) as { 
      userId: string; 
      email: string; 
      name: string; 
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true }
    });

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    // En cas d'erreur, on continue sans user (auth optionnelle)
    next();
  }
};
