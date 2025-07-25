import React from 'react';
import { Play, Clock, Users, Star, BookOpen, Video, Award, Calendar } from 'lucide-react';

const FormationView: React.FC = () => {
  const courses = [
    {
      id: 1,
      title: 'Maîtriser l\'éditeur WebUIZ',
      description: 'Apprenez toutes les fonctionnalités de base pour créer des sites web professionnels',
      duration: '2h 30min',
      level: 'Débutant',
      rating: 4.8,
      students: 1234,
      thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
      progress: 65
    },
    {
      id: 2,
      title: 'Design avancé et UX',
      description: 'Créez des interfaces utilisateur modernes et engageantes',
      duration: '3h 15min',
      level: 'Intermédiaire',
      rating: 4.9,
      students: 856,
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      progress: 0
    },
    {
      id: 3,
      title: 'Responsive Design et Mobile-First',
      description: 'Optimisez vos sites pour tous les appareils',
      duration: '1h 45min',
      level: 'Intermédiaire',
      rating: 4.7,
      students: 642,
      thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
      progress: 100
    }
  ];

  const webinars = [
    {
      id: 1,
      title: 'Nouvelles fonctionnalités IA de WebUIZ',
      date: '2025-01-20',
      time: '14:00',
      speaker: 'Sarah Johnson, Product Manager',
      attendees: 156,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Monétiser vos templates sur la Marketplace',
      date: '2025-01-25',
      time: '16:00',
      speaker: 'Marc Dubois, Marketing Director',
      attendees: 98,
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Best Practices pour le SEO',
      date: '2025-01-15',
      time: '15:00',
      speaker: 'Lisa Chen, SEO Expert',
      attendees: 234,
      status: 'replay'
    }
  ];

  const achievements = [
    { id: 1, title: 'Premier site créé', icon: '🎉', unlocked: true },
    { id: 2, title: 'Maître du drag & drop', icon: '🎯', unlocked: true },
    { id: 3, title: 'Template vendu', icon: '💰', unlocked: false },
    { id: 4, title: 'Expert responsive', icon: '📱', unlocked: true },
    { id: 5, title: 'Collaborateur actif', icon: '👥', unlocked: false },
    { id: 6, title: 'Formateur certifié', icon: '🎓', unlocked: false },
  ];

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-3xl font-bold mb-2">Formation & Apprentissage</h1>
        <p className="text-gray-600">Développez vos compétences et maîtrisez WebUIZ</p>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cours suivis</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Heures d'apprentissage</p>
                <p className="text-2xl font-bold">12h</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Webinaires suivis</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Video className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Badges obtenus</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cours */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Parcours de formation</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{course.duration}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star size={12} />
                            <span>{course.rating}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users size={12} />
                            <span>{course.students}</span>
                          </span>
                        </div>
                        {course.progress > 0 && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Progression</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-blue-600 h-1 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        <Play size={12} />
                        <span>{course.progress > 0 ? 'Continuer' : 'Commencer'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Webinaires */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Webinaires</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {webinars.map(webinar => (
                  <div key={webinar.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{webinar.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{webinar.speaker}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Calendar size={12} />
                            <span>{new Date(webinar.date).toLocaleDateString()}</span>
                          </span>
                          <span>{webinar.time}</span>
                          <span className="flex items-center space-x-1">
                            <Users size={12} />
                            <span>{webinar.attendees} participants</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          webinar.status === 'upcoming'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {webinar.status === 'upcoming' ? 'À venir' : 'Replay'}
                        </span>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                          {webinar.status === 'upcoming' ? 'S\'inscrire' : 'Regarder'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Badges et réalisations</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`text-center p-4 rounded-lg border-2 ${
                    achievement.unlocked
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`text-3xl mb-2 ${!achievement.unlocked ? 'grayscale opacity-50' : ''}`}>
                    {achievement.icon}
                  </div>
                  <h3 className={`font-medium text-sm ${
                    achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h3>
                  {achievement.unlocked && (
                    <div className="mt-1">
                      <Award className="w-4 h-4 text-yellow-500 mx-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormationView;