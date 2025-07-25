import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';

// Import des routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import templateRoutes from './routes/templates';
import mediaRoutes from './routes/media';
import feedbackRoutes from './routes/feedback';
import userRoutes from './routes/users';
import accessibilityRoutes from './routes/accessibility';

// Import des middlewares
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';

// Initialisation de Prisma
export const prisma = new PrismaClient();

// Création de l'application Express
const app = express();

// Middlewares de sécurité et logging
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes publiques (sans authentification)
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);

// Routes protégées (avec authentification)
app.use('/api/projects', authenticateToken, projectRoutes);
app.use('/api/media', authenticateToken, mediaRoutes);
app.use('/api/feedback', authenticateToken, feedbackRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/accessibility', authenticateToken, accessibilityRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend WebUIZ fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler);

// Gestion de la fermeture propre de Prisma
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default app;
