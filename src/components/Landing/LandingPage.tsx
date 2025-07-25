import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layout, 
  Zap, 
  Smartphone, 
  Palette, 
  Globe, 
  ArrowRight,
  Check,
  Star,
  Play,
  Sparkles,
  MousePointer,
  Layers,
  Move
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [dragDemo, setDragDemo] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDragDemo({
        x: Math.sin(Date.now() / 1000) * 50,
        y: Math.cos(Date.now() / 1500) * 30
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Layout,
      title: 'Éditeur Drag & Drop',
      description: 'Créez votre site en glissant-déposant des composants. Aucune compétence technique requise.'
    },
    {
      icon: Smartphone,
      title: 'Design Responsive',
      description: 'Votre site s\'adapte automatiquement à tous les écrans : mobile, tablette, ordinateur.'
    },
    {
      icon: Zap,
      title: 'Publication Instantanée',
      description: 'Publiez votre site en un clic et obtenez immédiatement votre URL personnalisée.'
    },
    {
      icon: Palette,
      title: 'Templates Modernes',
      description: 'Choisissez parmi une sélection de designs professionnels et personnalisez-les.'
    },
    {
      icon: Globe,
      title: 'SEO Optimisé',
      description: 'Votre site est automatiquement optimisé pour les moteurs de recherche.'
    },
    {
      icon: Sparkles,
      title: 'IA Intégrée',
      description: 'Laissez l\'intelligence artificielle vous aider à créer du contenu de qualité.'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      role: 'Photographe',
      content: 'J\'ai créé mon portfolio en moins d\'une heure. L\'interface est intuitive et le résultat professionnel.',
      rating: 5
    },
    {
      name: 'Pierre Martin',
      role: 'Consultant',
      content: 'Parfait pour créer rapidement un site vitrine. Mes clients sont impressionnés par le design.',
      rating: 5
    },
    {
      name: 'Sophie Bernard',
      role: 'Artiste',
      content: 'Enfin un outil qui me permet de me concentrer sur mon art plutôt que sur la technique !',
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: 'Gratuit',
      price: '0€',
      period: '/mois',
      features: [
        'Un site vitrine',
        'Templates de base',
        'Hébergement inclus',
        'Support communautaire'
      ],
      cta: 'Commencer gratuitement',
      popular: false
    },
    {
      name: 'Pro',
      price: '9€',
      period: '/mois',
      features: [
        'Site avec domaine personnalisé',
        'Tous les templates premium',
        'Assistant IA avancé',
        'Analytics détaillées',
        'Support prioritaire'
      ],
      cta: 'Essayer 14 jours gratuits',
      popular: true
    }
  ];

  return (
    <div className="min-h-screen theme-bg">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="w-24 h-12 rounded-lg flex items-center justify-center">
              <img
                src="public/images/logo_la_ou_pala.png"           
                alt="Logo la ou pala"     
                className="w-32 h-32 object-contain" 
              />
            </div>
          </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green transition-colors">Fonctionnalités</a>
              <a href="#pricing" className="text-gray-600 hover:text-green transition-colors">Tarifs</a>
              <a href="#testimonials" className="text-gray-600 hover:text-green transition-colors">Témoignages</a>
              <a href="#contact" className="text-gray-600 hover:text-green transition-colors">Contact</a>
            </nav>
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-lavender-violet text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              Commencer son site internet 
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="hero-section min-h-screen w-full gradient-lavender-violet py-20 relative overflow-hidden">
        <div className="container absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-white rounded-full animate-pulse delay-2000"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hero-grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-container lg:text-center"
            >
              <h1 className="titre text-3xl lg:leading-[5rem] lg:text-[5rem] font-bold text-white mb-6">
                Créez votre site vitrine en
                <span className=""> quelques minutes</span>
              </h1>
              <p className="text-xl mb-6 text-purple-100">
                Avec la ou pala, créez facilement un site web professionnel sans aucune compétence technique. <br />
                Glissez, déposez, personnalisez et publiez !
              </p>
              <div className="flex flex-col mb-10 sm:flex-row gap-4 justify-center lg:justify-center">
                <motion.button
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <span>Créer mon site</span>
                  <ArrowRight size={20} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:hover:text-green transition-all flex items-center justify-center space-x-2"
                >
                  <Play size={20} />
                  <span>Voir la démo</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Animated Editor Demo */}
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="bg-white rounded-lg p-4 relative min-h-[200px]">
                    <motion.div
                      animate={{
                        x: dragDemo.x,
                        y: dragDemo.y
                      }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="absolute top-4 left-4 bg-purple-100 border-2 border-purple-300 rounded-lg p-3 cursor-move"
                    >
                      <div className="flex items-center space-x-2">
                        <Move size={16} className="text-green" />
                        <span className="text-sm font-medium">Titre</span>
                      </div>
                    </motion.div>
                    
                    <div className="absolute top-16 right-4 bg-blue-100 border-2 border-blue-300 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Layers size={16} className="text-blue-600" />
                        <span className="text-sm font-medium">Image</span>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-100 border-2 border-green-300 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <MousePointer size={16} className="text-green-600" />
                        <span className="text-sm font-medium">Bouton</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600">
                  ✨ Glissez-déposez vos composants
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 theme-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold theme-dark mb-4"
            >
              Tout ce dont vous avez besoin
            </motion.h2>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600"
            >
              Des outils puissants et simples pour créer le site de vos rêves
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover-lift"
                >
                  <div className="w-16 h-16 theme-lavender rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon size={32} className="theme-violet" />
                  </div>
                  <h3 className="text-xl font-semibold theme-dark mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold theme-dark mb-4"
            >
              Tarifs simples et transparents
            </motion.h2>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600"
            >
              Commencez gratuitement, évoluez selon vos besoins
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className={`bg-white rounded-xl shadow-lg p-8 relative hover-lift ${
                  plan.popular ? 'ring-2 ring-purple-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="gradient-lavender-violet text-white px-4 py-1 rounded-full text-sm font-medium">
                      Le plus populaire
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold theme-dark mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold theme-violet">{plan.price}</span>
                    <span className="text-xl text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex}
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                      className="flex items-center"
                    >
                      <Check size={20} className="text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.button
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'gradient-lavender-violet text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 theme-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold theme-dark mb-4"
            >
              Ils nous font confiance
            </motion.h2>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600"
            >
              Découvrez ce que nos utilisateurs pensent de la ou pala
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-lg hover-lift"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold theme-dark">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-lavender-violet relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-20 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Prêt à créer votre site ?
          </motion.h2>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-purple-100 mb-8"
          >
            Rejoignez des milliers d'utilisateurs qui ont déjà créé leur site avec la ou pala
          </motion.p>
          <motion.button
            onClick={onGetStarted}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white text-green px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all"
          >
            Commencer maintenant
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 gradient-lavender-violet rounded-lg flex items-center justify-center">
                  <Layout size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold">la ou pala</span>
              </div>
              <p className="text-gray-400">
                La plateforme de création de sites web la plus simple et puissante.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white">Templates</a></li>
                <li><a href="#" className="hover:text-white">Tarifs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Statut</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white">Conditions</a></li>
                <li><a href="#" className="hover:text-white">RGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 la ou pala. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;