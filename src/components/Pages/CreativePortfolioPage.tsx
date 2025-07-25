import React from 'react';
import '../../styles/creative-portfolio.scss';

const CreativePortfolioPage: React.FC = () => {
  return (
    <div className="creative-portfolio-template">
      {/* Header Navigation */}
      <nav className="creative-portfolio-header">
        <div className="logo">Creative Studio</div>
        <div className="nav-links">
          <a href="#home">Accueil</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="creative-portfolio-hero">
        <div style={{ zIndex: 2 }}>
          <h1>Designer Créatif</h1>
          <p>Créateur d'expériences visuelles uniques et mémorables</p>
          <button>Découvrir mon travail</button>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="creative-portfolio-gallery">
        <div className="gallery-grid">
          <img src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Projet 1" />
          <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Projet 2" />
          <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Projet 3" />
          <img src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Projet 4" />
          <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Projet 5" />
          <img src="https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Projet 6" />
        </div>
      </section>

      {/* Services Section */}
      <section className="creative-portfolio-services">
        <h2>Mes Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="icon">🎨</div>
            <h3>Design Graphique</h3>
            <p>Création d'identités visuelles, logos, et supports de communication percutants</p>
          </div>
          <div className="service-card" style={{ animationDelay: '0.2s' }}>
            <div className="icon">📱</div>
            <h3>UI/UX Design</h3>
            <p>Interfaces utilisateur intuitives et expériences digitales mémorables</p>
          </div>
          <div className="service-card" style={{ animationDelay: '0.4s' }}>
            <div className="icon">🎬</div>
            <h3>Motion Design</h3>
            <p>Animations et vidéos créatives pour captiver votre audience</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="creative-portfolio-footer">
        <div className="footer-content">
          <h3>Travaillons Ensemble</h3>
          <p>Prêt à donner vie à vos idées créatives ? Contactez-moi pour discuter de votre prochain projet.</p>
          
          <div className="social-icons">
            <a href="#" className="social-icon">📧</a>
            <a href="#" className="social-icon" style={{ color: '#ef4444' }}>📱</a>
            <a href="#" className="social-icon" style={{ color: '#8b5cf6' }}>💼</a>
            <a href="#" className="social-icon" style={{ color: '#10b981' }}>🎨</a>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Creative Studio. Tous droits réservés.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Fait avec ❤️ et beaucoup de ☕</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreativePortfolioPage;
