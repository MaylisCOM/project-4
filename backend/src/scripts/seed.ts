import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  try {
    // Nettoyage des données existantes
    console.log('🧹 Nettoyage des données existantes...');
    await prisma.feedbackResponse.deleteMany();
    await prisma.feedbackItem.deleteMany();
    await prisma.mediaItem.deleteMany();
    await prisma.component.deleteMany();
    await prisma.page.deleteMany();
    await prisma.project.deleteMany();
    await prisma.template.deleteMany();
    await prisma.user.deleteMany();

    // Création d'utilisateurs de test
    console.log('👤 Création des utilisateurs de test...');
    const hashedPassword = await bcrypt.hash('password123', 12);

    const user1 = await prisma.user.create({
      data: {
        name: 'Alice Dupont',
        email: 'alice@example.com',
        password: hashedPassword,
        language: 'fr',
        theme: 'light',
        notifications: true
      }
    });

    const user2 = await prisma.user.create({
      data: {
        name: 'Bob Martin',
        email: 'bob@example.com',
        password: hashedPassword,
        language: 'fr',
        theme: 'dark',
        notifications: false
      }
    });

    // Création de templates
    console.log('🎨 Création des templates...');
    const template1 = await prisma.template.create({
      data: {
        name: 'Business Pro',
        description: 'Template professionnel pour entreprises avec sections complètes',
        thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'business',
        isPremium: true,
        price: 29,
        author: 'WebUIZ Team',
        rating: 4.8,
        downloads: 1234,
        seoScore: 85,
        accessibilityScore: 90,
        performanceScore: 88,
        components: JSON.stringify([
          {
            id: 'hero-1',
            type: 'hero',
            content: {
              title: 'Développez votre business avec style',
              subtitle: 'Une solution complète pour présenter votre entreprise de manière professionnelle',
              buttonText: 'Découvrir nos services',
              backgroundImage: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920'
            },
            styles: {
              padding: '6rem 2rem',
              textAlign: 'center',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white'
            },
            position: { x: 0, y: 0 },
            size: { width: '100%', height: 'auto' }
          }
        ])
      }
    });

    const template2 = await prisma.template.create({
      data: {
        name: 'Portfolio Creative',
        description: 'Showcase créatif pour artistes et designers',
        thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'portfolio',
        isPremium: false,
        author: 'Sarah Johnson',
        rating: 4.6,
        downloads: 856,
        seoScore: 78,
        accessibilityScore: 85,
        performanceScore: 92,
        components: JSON.stringify([
          {
            id: 'hero-2',
            type: 'hero',
            content: {
              title: 'Portfolio Créatif',
              subtitle: 'Découvrez mes créations et mon univers artistique',
              buttonText: 'Voir mes œuvres',
              backgroundImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1920'
            },
            styles: {
              padding: '5rem 2rem',
              textAlign: 'center',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white'
            },
            position: { x: 0, y: 0 },
            size: { width: '100%', height: 'auto' }
          }
        ])
      }
    });

    // Création de projets
    console.log('📁 Création des projets...');
    const project1 = await prisma.project.create({
      data: {
        name: 'Mon premier site',
        userId: user1.id,
        seoTitle: 'Mon Premier Site Web',
        seoDescription: 'Un site web créé avec WebUIZ',
        seoKeywords: JSON.stringify(['site web', 'création', 'webuiz']),
        seoLanguage: 'fr',
        languages: JSON.stringify(['fr']),
        currentLanguage: 'fr',
        loadTime: 2.3,
        seoScore: 78,
        accessibilityScore: 85,
        mobileScore: 95
      }
    });

    const project2 = await prisma.project.create({
      data: {
        name: 'Portfolio personnel',
        userId: user1.id,
        isPublished: true,
        url: 'https://portfolio-alice.webuiz.com',
        seoTitle: 'Portfolio Alice Dupont',
        seoDescription: 'Portfolio professionnel d\'Alice Dupont',
        seoKeywords: JSON.stringify(['portfolio', 'design', 'créatif']),
        seoLanguage: 'fr',
        languages: JSON.stringify(['fr', 'en']),
        currentLanguage: 'fr',
        loadTime: 1.8,
        seoScore: 92,
        accessibilityScore: 88,
        mobileScore: 97
      }
    });

    // Création de pages
    console.log('📄 Création des pages...');
    const page1 = await prisma.page.create({
      data: {
        name: 'Accueil',
        slug: '',
        isHomePage: true,
        projectId: project1.id,
        seoTitle: 'Accueil - Mon Premier Site',
        seoDescription: 'Page d\'accueil de mon premier site web'
      }
    });

    const page2 = await prisma.page.create({
      data: {
        name: 'À propos',
        slug: 'a-propos',
        projectId: project1.id,
        seoTitle: 'À propos - Mon Premier Site',
        seoDescription: 'En savoir plus sur moi et mon parcours'
      }
    });

    // Création de composants
    console.log('🧩 Création des composants...');
    await prisma.component.create({
      data: {
        type: 'hero',
        content: JSON.stringify({
          title: 'Bienvenue sur mon site',
          subtitle: 'Découvrez mon univers créatif',
          buttonText: 'En savoir plus'
        }),
        styles: JSON.stringify({
          backgroundColor: '#1a202c',
          color: 'white',
          padding: '4rem 2rem',
          textAlign: 'center'
        }),
        positionX: 0,
        positionY: 0,
        width: '100%',
        height: '400px',
        projectId: project1.id,
        pageId: page1.id,
        seoTitle: 'Section héro principale',
        seoDescription: 'Section d\'introduction du site'
      }
    });

    await prisma.component.create({
      data: {
        type: 'text',
        content: JSON.stringify({
          text: 'Je suis passionnée par la création de sites web modernes et accessibles.'
        }),
        styles: JSON.stringify({
          fontSize: '1.2rem',
          padding: '2rem',
          textAlign: 'center'
        }),
        positionX: 0,
        positionY: 400,
        width: '100%',
        height: 'auto',
        projectId: project1.id,
        pageId: page2.id
      }
    });

    // Création de médias
    console.log('🖼️ Création des médias...');
    await prisma.mediaItem.create({
      data: {
        name: 'hero-image.jpg',
        url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'image',
        size: 245760,
        projectId: project1.id
      }
    });

    await prisma.mediaItem.create({
      data: {
        name: 'business-team.jpg',
        url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'image',
        size: 189440,
        projectId: project2.id
      }
    });

    // Création de feedbacks
    console.log('💬 Création des feedbacks...');
    const feedback1 = await prisma.feedbackItem.create({
      data: {
        type: 'feature',
        title: 'Ajouter un mode sombre',
        description: 'Il serait génial d\'avoir un mode sombre pour l\'éditeur',
        status: 'open',
        priority: 'medium',
        votes: 15,
        userId: user1.id
      }
    });

    const feedback2 = await prisma.feedbackItem.create({
      data: {
        type: 'bug',
        title: 'Problème de sauvegarde',
        description: 'Parfois les modifications ne se sauvegardent pas correctement',
        status: 'in-progress',
        priority: 'high',
        votes: 8,
        userId: user2.id
      }
    });

    // Création de réponses aux feedbacks
    console.log('💭 Création des réponses aux feedbacks...');
    await prisma.feedbackResponse.create({
      data: {
        message: 'Excellente idée ! Nous travaillons déjà sur cette fonctionnalité.',
        isOfficial: true,
        userId: user2.id,
        feedbackId: feedback1.id
      }
    });

    await prisma.feedbackResponse.create({
      data: {
        message: 'J\'ai le même problème, merci de l\'avoir signalé !',
        isOfficial: false,
        userId: user1.id,
        feedbackId: feedback2.id
      }
    });

    console.log('✅ Seeding terminé avec succès !');
    console.log('\n📊 Données créées :');
    console.log(`👤 Utilisateurs: 2`);
    console.log(`🎨 Templates: 2`);
    console.log(`📁 Projets: 2`);
    console.log(`📄 Pages: 2`);
    console.log(`🧩 Composants: 2`);
    console.log(`🖼️ Médias: 2`);
    console.log(`💬 Feedbacks: 2`);
    console.log(`💭 Réponses: 2`);
    
    console.log('\n🔑 Comptes de test :');
    console.log('Email: alice@example.com | Mot de passe: password123');
    console.log('Email: bob@example.com | Mot de passe: password123');

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
