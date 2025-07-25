import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Configuration JWT
const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-super-securise';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Interface pour les données d'inscription
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Interface pour les données de connexion
interface LoginData {
  email: string;
  password: string;
}

// Route d'inscription
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password }: RegisterData = req.body;

    // Validation des données
    if (!name || !email || !password) {
      throw createError('Nom, email et mot de passe requis', 400, 'MISSING_FIELDS');
    }

    if (password.length < 6) {
      throw createError('Le mot de passe doit contenir au moins 6 caractères', 400, 'PASSWORD_TOO_SHORT');
    }

    // Vérification de l'email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError('Format d\'email invalide', 400, 'INVALID_EMAIL');
    }

    // Vérification si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw createError('Un utilisateur avec cet email existe déjà', 409, 'USER_EXISTS');
    }

    // Hachage du mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        language: true,
        theme: true,
        notifications: true
      }
    });

    // Génération du token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user,
      token
    });

  } catch (error) {
    next(error);
  }
});

// Route de connexion
router.post('/login', async (req, res, next) => {
  try {
    const { email, password }: LoginData = req.body;

    // Validation des données
    if (!email || !password) {
      throw createError('Email et mot de passe requis', 400, 'MISSING_CREDENTIALS');
    }

    // Recherche de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw createError('Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS');
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError('Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS');
    }

    // Génération du token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Retour des données utilisateur (sans le mot de passe)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = user;

    res.json({
      message: 'Connexion réussie',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    next(error);
  }
});

// Route de vérification du token
router.get('/verify', async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw createError('Token requis', 401, 'NO_TOKEN');
    }

    // Vérification du token
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      userId: string; 
      email: string; 
      name: string; 
    };

    // Récupération des données utilisateur actualisées
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        language: true,
        theme: true,
        notifications: true
      }
    });

    if (!user) {
      throw createError('Utilisateur non trouvé', 404, 'USER_NOT_FOUND');
    }

    res.json({
      message: 'Token valide',
      user
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(createError('Token invalide', 401, 'INVALID_TOKEN'));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(createError('Token expiré', 401, 'TOKEN_EXPIRED'));
    }
    next(error);
  }
});

// Route de déconnexion (côté client principalement)
router.post('/logout', (req, res) => {
  res.json({
    message: 'Déconnexion réussie'
  });
});

export default router;
