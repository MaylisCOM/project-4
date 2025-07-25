import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  Smartphone, 
  Monitor, 
  Wifi, 
  Image,
  FileText,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Download
} from 'lucide-react';
import { Project } from '../../types';

interface PerformancePanelProps {
  project: Project;
  onOptimize: (optimizations: string[]) => void;
}

const PerformancePanel: React.FC<PerformancePanelProps> = ({ project, onOptimize }) => {
  const [performanceData, setPerformanceData] = useState({
    loadTime: 2.3,
    mobileScore: 95,
    desktopScore: 98,
    seoScore: 87,
    accessibilityScore: 92,
    bestPracticesScore: 89,
    firstContentfulPaint: 1.2,
    largestContentfulPaint: 2.1,
    cumulativeLayoutShift: 0.05,
    firstInputDelay: 12
  });

  const [optimizations] = useState([
    {
      type: 'images',
      title: 'Optimiser les images',
      description: 'Compresser et redimensionner les images pour réduire le temps de chargement',
      impact: 'high',
      savings: '1.2s',
      icon: Image
    },
    {
      type: 'css',
      title: 'Minifier le CSS',
      description: 'Réduire la taille des fichiers CSS en supprimant les espaces inutiles',
      impact: 'medium',
      savings: '0.3s',
      icon: FileText
    },
    {
      type: 'fonts',
      title: 'Optimiser les polices',
      description: 'Précharger les polices critiques et utiliser font-display: swap',
      impact: 'medium',
      savings: '0.4s',
      icon: FileText
    },
    {
      type: 'lazy-loading',
      title: 'Chargement différé',
      description: 'Charger les images et contenus non critiques uniquement quand nécessaire',
      impact: 'high',
      savings: '0.8s',
      icon: Download
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runPerformanceAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse de performance
    setTimeout(() => {
      setPerformanceData(prev => ({
        ...prev,
        loadTime: Math.random() * 2 + 1.5,
        mobileScore: Math.floor(Math.random() * 20 + 80),
        desktopScore: Math.floor(Math.random() * 15 + 85)
      }));
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const applyOptimization = (type: string) => {
    onOptimize([type]);
  };

  const applyAllOptimizations = () => {
    const allOptimizations = optimizations.map(opt => opt.type);
    onOptimize(allOptimizations);
  };

  useEffect(() => {
    // Simulation de mise à jour des métriques en temps réel
    const interval = setInterval(() => {
      setPerformanceData(prev => ({
        ...prev,
        firstInputDelay: Math.floor(Math.random() * 20 + 5),
        cumulativeLayoutShift: Math.random() * 0.1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center space-x-2">
            <Zap size={20} className="text-yellow-600" />
            <span>Performance</span>
          </h3>
          <button
            onClick={runPerformanceAnalysis}
            disabled={isAnalyzing}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyse...' : 'Analyser'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Scores principaux */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg ${getScoreBackground(performanceData.mobileScore)}`}>
            <div className="flex items-center justify-between mb-1">
              <Smartphone size={16} />
              <span className={`font-bold ${getScoreColor(performanceData.mobileScore)}`}>
                {performanceData.mobileScore}
              </span>
            </div>
            <p className="text-xs">Mobile</p>
          </div>
          
          <div className={`p-3 rounded-lg ${getScoreBackground(performanceData.desktopScore)}`}>
            <div className="flex items-center justify-between mb-1">
              <Monitor size={16} />
              <span className={`font-bold ${getScoreColor(performanceData.desktopScore)}`}>
                {performanceData.desktopScore}
              </span>
            </div>
            <p className="text-xs">Desktop</p>
          </div>
        </div>

        {/* Métriques détaillées */}
        <div>
          <h4 className="font-medium mb-3">Métriques Core Web Vitals</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Temps de chargement</p>
                <p className="text-xs text-gray-600">Load Time</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${performanceData.loadTime < 2 ? 'text-green-600' : performanceData.loadTime < 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {performanceData.loadTime.toFixed(1)}s
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">First Contentful Paint</p>
                <p className="text-xs text-gray-600">FCP</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${performanceData.firstContentfulPaint < 1.8 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {performanceData.firstContentfulPaint.toFixed(1)}s
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Largest Contentful Paint</p>
                <p className="text-xs text-gray-600">LCP</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${performanceData.largestContentfulPaint < 2.5 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {performanceData.largestContentfulPaint.toFixed(1)}s
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Cumulative Layout Shift</p>
                <p className="text-xs text-gray-600">CLS</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${performanceData.cumulativeLayoutShift < 0.1 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {performanceData.cumulativeLayoutShift.toFixed(3)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">First Input Delay</p>
                <p className="text-xs text-gray-600">FID</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${performanceData.firstInputDelay < 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {performanceData.firstInputDelay}ms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Optimisations suggérées */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Optimisations suggérées</h4>
            <button
              onClick={applyAllOptimizations}
              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            >
              Tout optimiser
            </button>
          </div>
          
          <div className="space-y-3">
            {optimizations.map((optimization, index) => {
              const Icon = optimization.icon;
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon size={16} className="text-blue-600" />
                      <span className="font-medium text-sm">{optimization.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(optimization.impact)}`}>
                        {optimization.impact}
                      </span>
                      <span className="text-xs font-bold text-green-600">
                        -{optimization.savings}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{optimization.description}</p>
                  <button
                    onClick={() => applyOptimization(optimization.type)}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Appliquer
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Historique des performances */}
        <div>
          <h4 className="font-medium mb-3">Historique</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Aujourd'hui</span>
              <span className="font-medium">{performanceData.loadTime.toFixed(1)}s</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Hier</span>
              <span className="font-medium">2.8s</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Il y a 7 jours</span>
              <span className="font-medium">3.1s</span>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700">
              <TrendingUp size={14} />
              <span className="text-xs font-medium">Amélioration de 26% ce mois</span>
            </div>
          </div>
        </div>

        {/* Conseils de performance */}
        <div>
          <h4 className="font-medium mb-3">Conseils</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-start space-x-2">
              <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Utilisez des formats d'image modernes (WebP, AVIF)</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Activez la compression gzip sur votre serveur</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Minimisez les requêtes HTTP</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircle size={12} className="text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Évitez les redirections multiples</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePanel;