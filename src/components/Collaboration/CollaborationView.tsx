import React from 'react';
import { Users, UserPlus, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const CollaborationView: React.FC = () => {
  const collaborators = [
    { id: 1, name: 'Marie Dupont', role: 'Editor', status: 'online', avatar: 'MD' },
    { id: 2, name: 'Pierre Martin', role: 'Viewer', status: 'offline', avatar: 'PM' },
    { id: 3, name: 'Sophie Bernard', role: 'Admin', status: 'online', avatar: 'SB' },
  ];

  const activities = [
    { id: 1, user: 'Marie Dupont', action: 'a modifié le titre principal', time: '2 min', type: 'edit' },
    { id: 2, user: 'Pierre Martin', action: 'a commenté la section hero', time: '5 min', type: 'comment' },
    { id: 3, user: 'Sophie Bernard', action: 'a ajouté un nouveau composant', time: '10 min', type: 'add' },
    { id: 4, user: 'Marie Dupont', action: 'a publié une nouvelle version', time: '1h', type: 'publish' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'edit': return <AlertCircle className="text-yellow-500" size={16} />;
      case 'comment': return <MessageCircle className="text-blue-500" size={16} />;
      case 'add': return <CheckCircle className="text-green-500" size={16} />;
      case 'publish': return <CheckCircle className="text-purple-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-3xl font-bold mb-2">Collaboration</h1>
        <p className="text-gray-600">Travaillez en équipe sur vos projets</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collaborateurs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Équipe du projet</h2>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700">
                  <UserPlus size={16} />
                  <span>Inviter</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {collaborators.map(collaborator => (
                  <div key={collaborator.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        collaborator.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {collaborator.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{collaborator.name}</p>
                        <p className="text-sm text-gray-600">{collaborator.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        collaborator.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm text-gray-600">{collaborator.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activité récente */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Activité récente</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Permissions et rôles */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Gestion des permissions</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Users className="mx-auto mb-2 text-red-500" size={24} />
                <h3 className="font-medium">Admin</h3>
                <p className="text-sm text-gray-600 mt-1">Accès complet au projet</p>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li>• Modifier le contenu</li>
                  <li>• Inviter des membres</li>
                  <li>• Publier le site</li>
                  <li>• Supprimer le projet</li>
                </ul>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Users className="mx-auto mb-2 text-blue-500" size={24} />
                <h3 className="font-medium">Editor</h3>
                <p className="text-sm text-gray-600 mt-1">Peut modifier le contenu</p>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li>• Modifier le contenu</li>
                  <li>• Ajouter des composants</li>
                  <li>• Sauvegarder les modifications</li>
                </ul>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Users className="mx-auto mb-2 text-green-500" size={24} />
                <h3 className="font-medium">Viewer</h3>
                <p className="text-sm text-gray-600 mt-1">Accès lecture seule</p>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li>• Voir le projet</li>
                  <li>• Laisser des commentaires</li>
                  <li>• Télécharger les assets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Chat en temps réel */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Discussion de l'équipe</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                  MD
                </div>
                <div className="flex-1">
                  <p className="text-sm"><span className="font-medium">Marie Dupont</span> · il y a 5 min</p>
                  <p className="text-sm text-gray-700 mt-1">Le nouveau design du header est parfait ! 👍</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium">
                  PM
                </div>
                <div className="flex-1">
                  <p className="text-sm"><span className="font-medium">Pierre Martin</span> · il y a 8 min</p>
                  <p className="text-sm text-gray-700 mt-1">Peut-on ajuster la couleur du bouton CTA ?</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Tapez votre message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationView;