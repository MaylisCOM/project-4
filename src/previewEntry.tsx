import React from 'react';
import ReactDOM from 'react-dom/client';
import PreviewPage from './components/Pages/PreviewPage';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <PreviewPage />
    </React.StrictMode>
  );
}
