import React, { useEffect, useState } from 'react';
import { Component, Page, Project } from '../../types';

const PreviewPage: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);

  useEffect(() => {
    // Load project data from localStorage
    const storedProject = localStorage.getItem('previewProject');
    const storedCurrentPageId = localStorage.getItem('previewCurrentPageId');

    if (storedProject && storedCurrentPageId) {
      const parsedProject: Project = JSON.parse(storedProject);
      setProject(parsedProject);

      const page = parsedProject.pages?.find(p => p.id === storedCurrentPageId);
      if (page) {
        setCurrentPage(page);
      }
    }
  }, []);

  if (!project || !currentPage) {
    return <div>Chargement de l'aperçu...</div>;
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
        <h1>{project.name}</h1>
        <h2>{currentPage.name}</h2>
      </header>
      <main>
        {currentPage.components.map((component: Component) => {
          switch (component.type) {
            case 'header':
              return (
                <h1 key={component.id} style={component.styles}>
                  {component.content?.text || 'Titre'}
                </h1>
              );
            case 'text':
              return (
                <p key={component.id} style={component.styles}>
                  {component.content?.text || 'Texte'}
                </p>
              );
            case 'button':
              return (
                <a
                  key={component.id}
                  href={component.content?.href || '#'}
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    ...component.styles
                  }}
                >
                  {component.content?.text || 'Bouton'}
                </a>
              );
            case 'image':
              return (
                <img
                  key={component.id}
                  src={component.content?.src}
                  alt={component.content?.alt || ''}
                  style={{ maxWidth: '100%', ...component.styles }}
                />
              );
            default:
              return null;
          }
        })}
      </main>
    </div>
  );
};

export default PreviewPage;
