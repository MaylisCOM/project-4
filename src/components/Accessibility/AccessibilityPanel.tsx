import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Volume2, 
  Type, 
  Palette, 
  MousePointer, 
  Keyboard,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader,
  RefreshCw
} from 'lucide-react';
import { Component, AccessibilityReport, AccessibilityIssue } from '../../types';
import { AccessibilityService, AccessibilitySettings } from '../../services/accessibilityService';

interface AccessibilityPanelProps {
  projectId: string;
  components: Component[];
  onUpdateComponent: (id: string, updates: Partial<Component>) => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  projectId,
  components,
  onUpdateComponent
}) => {
  const [activeTab, setActiveTab] = useState('audit');
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: true,
    keyboardNavigation: true,
    autoFix: false,
    realTimeAnalysis: true
  });

  const [auditReport, setAuditReport] = useState<AccessibilityReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);

  // Charger les données d'accessibilité au montage du composant
  useEffect(() => {
    loadAccessibilityData();
  }, [projectId]);

  // Recharger les données quand les composants changent
  useEffect(() => {
    if (accessibilitySettings.realTimeAnalysis && projectId) {
      const timeoutId = setTimeout(() => {
        loadAccessibilityData();
      }, 1000); // Délai pour éviter trop d'appels

      return () => clearTimeout(timeoutId);
    }
  }, [components, accessibilitySettings.realTimeAnalysis, projectId]);

  const loadAccessibilityData = async () => {
    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Charger le rapport d'audit
      const auditResponse = await AccessibilityService.analyzeProject(projectId);
      setAuditReport(auditResponse.report);
      setLastAnalyzed(new Date(auditResponse.analyzedAt));

      // Charger les paramètres
      const settingsResponse = await AccessibilityService.getSettings(projectId);
      setAccessibilitySettings(settingsResponse.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données d\'accessibilité');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAnalysis = async () => {
    await loadAccessibilityData();
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="text-red-500" size={16} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'info': return <Info className="text-blue-500" size={16} />;
      default: return <Info className="text-gray-500" size={16} />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSettingChange = async (setting: string, value: boolean) => {
    const newSettings = {
      ...accessibilitySettings,
      [setting]: value
    };
    
    setAccessibilitySettings(newSettings);
    
    // Appliquer les changements à l'interface
    AccessibilityService.applyAccessibilitySettings(newSettings);
    
    // Sauvegarder les paramètres
    try {
      await AccessibilityService.updateSettings(projectId, newSettings);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des paramètres:', err);
    }
  };

  const fixIssue = async (issue: AccessibilityIssue) => {
    if (!auditReport) return;
    
    try {
      setIsLoading(true);
      await AccessibilityService.fixIssues(projectId, [issue]);
      
      // Recharger les données après correction
      await loadAccessibilityData();
      
      // Notifier le parent du changement si nécessaire
      if (issue.componentId) {
        // Ici on pourrait récupérer les nouvelles données du composant
        // et notifier le parent, mais pour l'instant on laisse le rechargement global
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la correction automatique');
    } finally {
      setIsLoading(false);
    }
  };

  const runQuickTest = async (testType: 'keyboard' | 'screenReader' | 'contrast') => {
    try {
      setIsLoading(true);
      let result;
      
      switch (testType) {
        case 'keyboard':
          result = await AccessibilityService.testKeyboardNavigation();
          alert(result.success ? 'Test de navigation au clavier réussi !' : `Problèmes détectés: ${result.issues.join(', ')}`);
          break;
        case 'screenReader':
          result = await AccessibilityService.simulateScreenReader();
          console.log('Contenu pour lecteur d\'écran:', result.content);
          alert('Simulation du lecteur d\'écran terminée. Consultez la console pour les détails.');
          break;
        case 'contrast':
          result = await AccessibilityService.checkColorContrasts();
          alert(result.success ? 'Tous les contrastes sont conformes !' : `${result.issues.length} problème(s) de contraste détecté(s)`);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du test');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        <h3 className="font-semibold text-lg flex items-center space-x-2">
          <Eye size={20} className="text-green-600" />
          <span>Accessibilité</span>
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'audit'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Audit
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'settings'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Paramètres
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'audit' && (
          <div className="space-y-6">
            {/* Bouton de rafraîchissement */}
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Analyse d'accessibilité</h4>
              <button
                onClick={refreshAnalysis}
                disabled={isLoading}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                <span>Actualiser</span>
              </button>
            </div>

            {/* État de chargement */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader className="animate-spin mr-2" size={20} />
                <span className="text-gray-600">Analyse en cours...</span>
              </div>
            )}

            {/* Erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="text-red-500" size={16} />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Contenu principal */}
            {auditReport && !isLoading && (
              <>
                {/* Score d'accessibilité */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Score d'accessibilité</span>
                    <span className={`text-2xl font-bold ${getScoreColor(auditReport.score)}`}>
                      {auditReport.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${auditReport.score}%` }}
                    />
                  </div>
                  {lastAnalyzed && (
                    <p className="text-xs text-gray-500 mt-2">
                      Dernière analyse: {lastAnalyzed.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Problèmes détectés */}
                <div>
                  <h4 className="font-medium mb-3">
                    Problèmes détectés ({auditReport.issues.length})
                  </h4>
                  {auditReport.issues.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <CheckCircle className="mx-auto mb-2" size={24} />
                      <p>Aucun problème détecté !</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {auditReport.issues.map((issue, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start space-x-2 mb-2">
                            {getIssueIcon(issue.type)}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{issue.message}</p>
                              {issue.element && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Élément: {issue.element}
                                </p>
                              )}
                            </div>
                          </div>
                          {issue.fix && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                              <strong>Solution:</strong> {issue.fix}
                            </div>
                          )}
                          <button
                            onClick={() => fixIssue(issue)}
                            disabled={isLoading}
                            className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            Corriger automatiquement
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                <div>
                  <h4 className="font-medium mb-3">Suggestions d'amélioration</h4>
                  <div className="space-y-2">
                    {auditReport.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-green-50 rounded-lg">
                        <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-green-800">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tests rapides */}
                <div>
                  <h4 className="font-medium mb-3">Tests rapides</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => runQuickTest('keyboard')}
                      disabled={isLoading}
                      className="w-full p-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
                    >
                      <Keyboard size={16} className="inline mr-2" />
                      Tester la navigation au clavier
                    </button>
                    <button 
                      onClick={() => runQuickTest('screenReader')}
                      disabled={isLoading}
                      className="w-full p-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
                    >
                      <Volume2 size={16} className="inline mr-2" />
                      Simuler un lecteur d'écran
                    </button>
                    <button 
                      onClick={() => runQuickTest('contrast')}
                      disabled={isLoading}
                      className="w-full p-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
                    >
                      <Palette size={16} className="inline mr-2" />
                      Vérifier les contrastes
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Paramètres d'accessibilité</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Palette size={16} />
                    <span className="text-sm">Contraste élevé</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.highContrast}
                      onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Type size={16} />
                    <span className="text-sm">Texte large</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.largeText}
                      onChange={(e) => handleSettingChange('largeText', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MousePointer size={16} />
                    <span className="text-sm">Réduire les animations</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.reducedMotion}
                      onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 size={16} />
                    <span className="text-sm">Support lecteur d'écran</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.screenReader}
                      onChange={(e) => handleSettingChange('screenReader', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Keyboard size={16} />
                    <span className="text-sm">Navigation clavier</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.keyboardNavigation}
                      onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Guide d'accessibilité */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium mb-3">Guide d'accessibilité</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Utilisez des couleurs avec un contraste suffisant (4.5:1 minimum)</p>
                <p>• Ajoutez des textes alternatifs à toutes les images</p>
                <p>• Structurez votre contenu avec des titres hiérarchiques</p>
                <p>• Assurez-vous que tous les éléments sont accessibles au clavier</p>
                <p>• Utilisez des labels descriptifs pour les formulaires</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityPanel;