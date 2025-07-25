import React from 'react';
import '../../styles/modern-business.scss';

const ModernBusinessPage: React.FC = () => {
  return (
    <div className="modern-business-template">
      {/* Header Navigation */}
      <nav className="modern-business-nav">
        <div className="logo">MonEntreprise</div>
        <div className="nav-links">
          <a href="#accueil">Accueil</a>
          <a href="#services">Services</a>
          <a href="#about">À propos</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="modern-business-hero">
        <h1>Transformez votre vision en réalité</h1>
        <p>Solutions digitales innovantes pour propulser votre entreprise vers le succès</p>
        <button>Découvrir nos services</button>
      </section>

      {/* Services Section */}
      <section className="modern-business-services">
        <h2>Nos Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="icon">💻</div>
            <h3>Développement Web</h3>
            <p>Sites web modernes et performants avec les dernières technologies</p>
          </div>
          <div className="service-card">
            <div className="icon">🎨</div>
            <h3>Design UX/UI</h3>
            <p>Interfaces utilisateur intuitives et expériences mémorables</p>
          </div>
          <div className="service-card">
            <div className="icon">📈</div>
            <h3>Marketing Digital</h3>
            <p>Stratégies digitales pour maximiser votre visibilité en ligne</p>
          </div>
          <div className="service-card">
            <div className="icon">🚀</div>
            <h3>Consulting</h3>
            <p>Conseils experts pour optimiser votre transformation digitale</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="modern-business-about">
        <h2>À Propos de Nous</h2>
        <p className="about-content">
          Depuis plus de 10 ans, nous accompagnons les entreprises dans leur transformation digitale. 
          Notre équipe passionnée combine créativité et expertise technique pour créer des solutions 
          sur mesure qui dépassent vos attentes.
        </p>
        <div className="stats-grid">
          <div className="stat">
            <div className="stat-number">500+</div>
            <div className="stat-label">Projets réalisés</div>
          </div>
          <div className="stat">
            <div className="stat-number">98%</div>
            <div className="stat-label">Clients satisfaits</div>
          </div>
          <div className="stat">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support client</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="modern-business-footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>MonEntreprise</h3>
              <p>
                Votre partenaire de confiance pour tous vos projets digitaux. 
                Innovation, qualité et excellence à votre service.
              </p>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li><a href="#">Développement Web</a></li>
                <li><a href="#">Design UX/UI</a></li>
                <li><a href="#">Marketing Digital</a></li>
                <li><a href="#">Consulting</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <div className="contact-info">
                <p>📧 contact@monentreprise.com</p>
                <p>📞 +33 1 23 45 67 89</p>
                <p>📍 123 Rue de l'Innovation, Paris</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 MonEntreprise. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernBusinessPage;
