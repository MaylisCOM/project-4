import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Users,
  MousePointer,
  Mail,
  TrendingUp,
  Clock,
  Globe,
  Download,
  Bell,
  Calendar,
  BarChart3,
  Eye,
  Activity
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StatsDashboardProps {
  onClose: () => void;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ onClose }) => {
  const [timeFilter, setTimeFilter] = useState('7d');
  const [stats, setStats] = useState({
    visitors: { unique: 1234, total: 2456 },
    clicks: 456,
    contacts: 23,
    avgDuration: '2m 34s',
    bounceRate: 32.5,
    topPages: [
      { page: 'Accueil', views: 1234 },
      { page: 'Services', views: 567 },
      { page: 'Contact', views: 234 }
    ]
  });

  const visitorsData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Visiteurs uniques',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: '#8A2BE2',
        backgroundColor: 'rgba(138, 43, 226, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Visiteurs totaux',
        data: [120, 110, 150, 160, 110, 100, 80],
        borderColor: '#808000',
        backgroundColor: 'rgba(128, 128, 0, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const trafficSourcesData = {
    labels: ['Recherche Google', 'Direct', 'Réseaux sociaux', 'Référents', 'Email'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          '#8A2BE2',
          '#808000',
          '#E6E6FA',
          '#F0E8BB',
          '#9370DB'
        ],
        borderWidth: 0,
      }
    ]
  };

  const clicksData = {
    labels: ['CTA Principal', 'Contact', 'Téléphone', 'Email', 'Réseaux sociaux'],
    datasets: [
      {
        label: 'Clics',
        data: [120, 89, 67, 45, 23],
        backgroundColor: 'rgba(138, 43, 226, 0.8)',
        borderColor: '#8A2BE2',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] overflow-hidden"
        style={{ backgroundColor: '#F0E8BB' }}
      >
        {/* Header */}
        <div className="gradient-lavender-violet p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tableau de bord</h1>
              <p className="text-purple-100">Statistiques de votre site vitrine</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded-lg px-4 py-2"
              >
                <option value="24h">24 heures</option>
                <option value="7d">7 jours</option>
                <option value="30d">30 jours</option>
                <option value="90d">3 mois</option>
              </select>
              <button
                onClick={onClose}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto h-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* KPI Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Visiteurs uniques</p>
                    <p className="text-3xl font-bold theme-violet">{stats.visitors.unique.toLocaleString()}</p>
                    <p className="text-green-600 text-sm">+12% cette semaine</p>
                  </div>
                  <Users className="w-12 h-12 text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Clics totaux</p>
                    <p className="text-3xl font-bold theme-olive">{stats.clicks}</p>
                    <p className="text-green-600 text-sm">+8% cette semaine</p>
                  </div>
                  <MousePointer className="w-12 h-12 text-olive-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Demandes de contact</p>
                    <p className="text-3xl font-bold theme-violet">{stats.contacts}</p>
                    <p className="text-green-600 text-sm">+15% cette semaine</p>
                  </div>
                  <Mail className="w-12 h-12 text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Durée moyenne</p>
                    <p className="text-3xl font-bold theme-olive">{stats.avgDuration}</p>
                    <p className="text-green-600 text-sm">+5% cette semaine</p>
                  </div>
                  <Clock className="w-12 h-12 text-olive-500" />
                </div>
              </div>
            </motion.div>

            {/* Charts Row 1 */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 theme-dark">Évolution des visiteurs</h3>
                <div className="chart-container">
                  <Line data={visitorsData} options={chartOptions} />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 theme-dark">Sources de trafic</h3>
                <div className="chart-container">
                  <Doughnut data={trafficSourcesData} options={chartOptions} />
                </div>
              </div>
            </motion.div>

            {/* Charts Row 2 */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 theme-dark">Clics par élément</h3>
                <div className="chart-container">
                  <Bar data={clicksData} options={chartOptions} />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 theme-dark">Pages les plus visitées</h3>
                <div className="space-y-4">
                  {stats.topPages.map((page, index) => (
                    <motion.div
                      key={page.page}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium">{page.page}</span>
                      <span className="theme-violet font-bold">{page.views} vues</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
                <Download size={20} />
                <span>Exporter PDF</span>
              </button>
              <button className="bg-olive-600 hover:bg-olive-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
                <Download size={20} />
                <span>Exporter CSV</span>
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
                <Bell size={20} />
                <span>Configurer alertes</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsDashboard;