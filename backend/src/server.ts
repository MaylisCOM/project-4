import app from './app';
import { prisma } from './app';

const PORT = process.env.PORT || 3001;

// Fonction pour démarrer le serveur
const startServer = async () => {
  try {
    // Test de connexion à la base de données
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur backend WebUIZ démarré sur le port ${PORT}`);
      console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📁 Fichiers média: http://localhost:${PORT}/api/media/files`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📋 Routes disponibles:');
        console.log('  🔐 Auth: /api/auth');
        console.log('  📁 Projets: /api/projects');
        console.log('  🎨 Templates: /api/templates');
        console.log('  🖼️  Médias: /api/media');
        console.log('  💬 Feedback: /api/feedback');
        console.log('  👤 Utilisateurs: /api/users');
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion propre de l'arrêt du serveur
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur en cours...');
  
  try {
    await prisma.$disconnect();
    console.log('✅ Déconnexion de la base de données réussie');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Signal SIGTERM reçu, arrêt du serveur...');
  
  try {
    await prisma.$disconnect();
    console.log('✅ Déconnexion de la base de données réussie');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion:', error);
    process.exit(1);
  }
});

// Démarrage du serveur
startServer();
