import { useEffect, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from 'recharts';
import axios from 'axios';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const DashboardUser = () => {
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('forage');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const extractCount = (response, endpoint) => {
    if (!response || !response.data) return 0;

    const data = response.data;
    console.log(`${endpoint} response:`, data);

    if (typeof data === 'number') {
      return data;
    }

    if (typeof data === 'object') {
      const possibleKeys = [
        'count', 'total', 'totalCount', 'totalForages', 'totalBarrages', 
        'totalNappes', 'totalNappesProfondes', 'totalClimat', 'totalVertisol',
        'totalGeologie', 'totalPedologie', 'totalDelegation', 'totalReseau'
      ];
      
      for (const key of possibleKeys) {
        if (data[key] !== undefined) {
          console.log(`✅ ${endpoint}: found key "${key}" = ${data[key]}`);
          return data[key];
        }
      }

      if (data.success) {
        for (const key in data) {
          if (key !== 'success' && typeof data[key] === 'number') {
            console.log(`✅ ${endpoint}: found success with key "${key}" = ${data[key]}`);
            return data[key];
          }
        }
      }

      if (Array.isArray(data)) {
        return data.length;
      }
    }

    console.log(`❌ ${endpoint}: no count found in response`);
    return 0;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const endpoints = [
        { key: 'users', url: 'http://localhost:8080/api/user/users/count' },
        { key: 'forages', url: 'http://localhost:8080/api/forages/count' },
        { key: 'barrages', url: 'http://localhost:8080/api/barrages/count' },
        { key: 'nappesPhreatic', url: 'http://localhost:8080/api/nappes/count' },
        { key: 'nappesDeep', url: 'http://localhost:8080/api/nappes-profondes/count' },
        { key: 'climat', url: 'http://localhost:8080/api/climat/count' },
        { key: 'delegation', url: 'http://localhost:8080/api/delegation/count' },
        { key: 'geologie', url: 'http://localhost:8080/api/geologie/count' },
        { key: 'cnBizerte', url: 'http://localhost:8080/api/cnbz/count' },
        { key: 'pedologie', url: 'http://localhost:8080/api/pedologie/count' },
        { key: 'vertisol', url: 'http://localhost:8080/api/vertisol/count' },
        { key: 'reseau', url: 'http://localhost:8080/api/reseau/count' },
        { key: 'sensor', url: 'http://localhost:8080/api/sensor/count' },
        { key: 'tds', url: 'http://localhost:8080/api/tds/count' },
        { key: 'ph', url: 'http://localhost:8080/api/ph/count' },
        { key: 'soil', url: 'http://localhost:8080/api/soil/count' }
      ];

      const requests = endpoints.map(endpoint => 
        axios.get(endpoint.url)
          .then(response => {
            const count = extractCount(response, endpoint.key);
            return { key: endpoint.key, count, error: null };
          })
          .catch(error => {
            console.error(`❌ ${endpoint.key} error:`, error.response?.data || error.message);
            return { key: endpoint.key, count: 0, error };
          })
      );

      const results = await Promise.all(requests);

      const stats = {};
      results.forEach(({ key, count }) => {
        stats[key] = count;
      });

      const mappedStats = {
        users: stats.users || 0,
        forages: stats.forages || 0,
        barrages: stats.barrages || 0,
        phreaticAquifers: stats.nappesPhreatic || 0,
        deepAquifers: stats.nappesDeep || 0,
        climate: stats.climat || 0,
        delegation: stats.delegation || 0,
        geology: stats.geologie || 0,
        cnBizerte: stats.cnBizerte || 0,
        pedology: stats.pedologie || 0,
        vertisol: stats.vertisol || 0,
        hydroNetwork: stats.reseau || 0,
        sensorData: stats.sensor || 0,
        tdsData: stats.tds || 0,
        phData: stats.ph || 0,
        soilHumidityData: stats.soil || 0
      };

      setDashboardStats(mappedStats);
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
    } finally {
      setLoading(false);
    }
  };

  // Données simulées pour chaque section
  const sectionData = {
    forage: {
      title: '⛏️ Forages',
      icon: '⛏️',
      color: '#10B981',
      stats: {
        total: dashboardStats.forages || 0,
        active: 387,
        maintenance: 45,
        inactive: 82
      },
      chartData: [
        { name: 'Nord', count: 156 },
        { name: 'Sud', count: 89 },
        { name: 'Est', count: 134 },
        { name: 'Ouest', count: 135 }
      ],
      recentData: [
        { id: 1, name: 'Forage Bizerte Nord', date: '2024-01-15', status: 'Actif', depth: 120 },
        { id: 2, name: 'Forage Tunis Sud', date: '2024-01-14', status: 'Maintenance', depth: 85 },
        { id: 3, name: 'Forage Nabeul Est', date: '2024-01-13', status: 'Actif', depth: 150 }
      ]
    },
    barrage: {
      title: '🏗️ Barrages',
      icon: '🏗️',
      color: '#F59E0B',
      stats: {
        total: dashboardStats.barrages || 0,
        capacity: '2.5M m³',
        active: 32,
        underConstruction: 4
      },
      chartData: [
        { name: 'Barrage poids', count: 12 },
        { name: 'Barrage voûte', count: 8 },
        { name: 'Barrage remblai', count: 15 },
        { name: 'Barrage mixte', count: 5 }
      ],
      recentData: [
        { id: 1, name: 'Barrage Sidi Salem', date: '2024-01-15', capacity: '500K m³', status: 'Plein' },
        { id: 2, name: 'Barrage Lebna', date: '2024-01-14', capacity: '300K m³', status: '75%' },
        { id: 3, name: 'Barrage Sidi El Barrak', date: '2024-01-13', capacity: '400K m³', status: '90%' }
      ]
    },
    climat: {
      title: '🌤️ Climat',
      icon: '🌤️',
      color: '#06B6D4',
      stats: {
        total: dashboardStats.climate || 0,
        temperature: '23.5°C',
        humidity: '65%',
        rainfall: '45mm'
      },
      chartData: [
        { name: 'Jan', temp: 15, rain: 45 },
        { name: 'Fév', temp: 16, rain: 38 },
        { name: 'Mar', temp: 18, rain: 52 },
        { name: 'Avr', temp: 21, rain: 40 },
        { name: 'Mai', temp: 25, rain: 28 },
        { name: 'Jun', temp: 29, rain: 12 }
      ],
      recentData: [
        { id: 1, station: 'Station Tunis', temp: '24°C', humidity: '68%', date: '2024-01-15' },
        { id: 2, station: 'Station Bizerte', temp: '22°C', humidity: '72%', date: '2024-01-15' },
        { id: 3, station: 'Station Nabeul', temp: '25°C', humidity: '65%', date: '2024-01-15' }
      ]
    },
    nappeProfonde: {
      title: '💧 Nappes Profondes',
      icon: '💧',
      color: '#8B5CF6',
      stats: {
        total: dashboardStats.deepAquifers || 0,
        averageDepth: '185m',
        monitored: 45,
        critical: 8
      },
      chartData: [
        { name: '0-100m', count: 12 },
        { name: '100-200m', count: 18 },
        { name: '200-300m', count: 10 },
        { name: '300m+', count: 5 }
      ],
      recentData: [
        { id: 1, name: 'Nappe Profonde Nord', depth: '250m', level: '85%', date: '2024-01-15' },
        { id: 2, name: 'Nappe Profonde Sud', depth: '180m', level: '72%', date: '2024-01-14' },
        { id: 3, name: 'Nappe Profonde Est', depth: '320m', level: '68%', date: '2024-01-13' }
      ]
    },
    nappePhreatique: {
      title: '🌊 Nappes Phréatiques',
      icon: '🌊',
      color: '#3B82F6',
      stats: {
        total: dashboardStats.phreaticAquifers || 0,
        averageDepth: '35m',
        monitored: 67,
        critical: 12
      },
      chartData: [
        { name: '0-20m', count: 25 },
        { name: '20-40m', count: 28 },
        { name: '40-60m', count: 12 },
        { name: '60m+', count: 2 }
      ],
      recentData: [
        { id: 1, name: 'Nappe Phréatique Côtière', depth: '28m', level: '78%', date: '2024-01-15' },
        { id: 2, name: 'Nappe Phréatique Intérieure', depth: '42m', level: '65%', date: '2024-01-14' },
        { id: 3, name: 'Nappe Phréatique Oasis', depth: '15m', level: '82%', date: '2024-01-13' }
      ]
    },
    geologie: {
      title: '🪨 Géologie',
      icon: '🪨',
      color: '#EF4444',
      stats: {
        total: dashboardStats.geology || 0,
        formations: 24,
        sites: 156,
        analyses: 489
      },
      chartData: [
        { name: 'Calcaire', count: 45 },
        { name: 'Grès', count: 32 },
        { name: 'Argile', count: 28 },
        { name: 'Basalte', count: 18 },
        { name: 'Autres', count: 33 }
      ],
      recentData: [
        { id: 1, site: 'Site Géologique Nord', formation: 'Calcaire', date: '2024-01-15', status: 'Analysé' },
        { id: 2, site: 'Site Géologique Sud', formation: 'Grès', date: '2024-01-14', status: 'En cours' },
        { id: 3, site: 'Site Géologique Est', formation: 'Basalte', date: '2024-01-13', status: 'Analysé' }
      ]
    },
    delegation: {
      title: '🏛️ Délégation',
      icon: '🏛️',
      color: '#EC4899',
      stats: {
        total: dashboardStats.delegation || 0,
        regions: 24,
        communes: 156,
        projets: 89
      },
      chartData: [
        { name: 'Bizerte Nord', count: 12 },
        { name: 'Bizerte Sud', count: 8 },
        { name: 'Mateur', count: 15 },
        { name: 'Menzel Bourguiba', count: 10 },
        { name: 'Utique', count: 7 }
      ],
      recentData: [
        { id: 1, name: 'Délégation Bizerte Ville', region: 'Bizerte Nord', date: '2024-01-15', projets: 12 },
        { id: 2, name: 'Délégation Menzel Jemil', region: 'Bizerte Sud', date: '2024-01-14', projets: 8 },
        { id: 3, name: 'Délégation Ghar El Melh', region: 'Utique', date: '2024-01-13', projets: 5 }
      ]
    },
    cnBizerte: {
      title: '📐 Courbes de Niveau',
      icon: '📐',
      color: '#84CC16',
      stats: {
        total: dashboardStats.cnBizerte || 0,
        lignes: 2456,
        zones: 45,
        altitudeMax: '560m'
      },
      chartData: [
        { name: '0-100m', count: 456 },
        { name: '100-200m', count: 789 },
        { name: '200-300m', count: 654 },
        { name: '300-400m', count: 432 },
        { name: '400m+', count: 125 }
      ],
      recentData: [
        { id: 1, zone: 'Zone Montagneuse Nord', altitude: '450m', lignes: 156, date: '2024-01-15' },
        { id: 2, zone: 'Zone Côtière', altitude: '25m', lignes: 89, date: '2024-01-14' },
        { id: 3, zone: 'Zone Plateau Central', altitude: '320m', lignes: 134, date: '2024-01-13' }
      ]
    },
    pedologie: {
      title: '🌱 Pédologie',
      icon: '🌱',
      color: '#F97316',
      stats: {
        total: dashboardStats.pedology || 0,
        typesSol: 12,
        echantillons: 345,
        analyses: 678
      },
      chartData: [
        { name: 'Argileux', count: 45 },
        { name: 'Sableux', count: 32 },
        { name: 'Limon', count: 28 },
        { name: 'Calcaire', count: 18 },
        { name: 'Autres', count: 23 }
      ],
      recentData: [
        { id: 1, site: 'Site Pédologique Nord', type: 'Argileux', date: '2024-01-15', pH: '7.2' },
        { id: 2, site: 'Site Pédologique Sud', type: 'Sableux', date: '2024-01-14', pH: '6.8' },
        { id: 3, site: 'Site Pédologique Est', type: 'Limon', date: '2024-01-13', pH: '7.0' }
      ]
    },
    vertisol: {
      title: '🟫 Vertisol',
      icon: '🟫',
      color: '#8B5CF6',
      stats: {
        total: dashboardStats.vertisol || 0,
        zones: 18,
        echantillons: 234,
        analyses: 567
      },
      chartData: [
        { name: 'Vertisol typique', count: 56 },
        { name: 'Vertisol calcique', count: 34 },
        { name: 'Vertisol gypsique', count: 22 },
        { name: 'Autres types', count: 18 }
      ],
      recentData: [
        { id: 1, zone: 'Zone Vertisol Nord', type: 'Typique', date: '2024-01-15', argile: '65%' },
        { id: 2, zone: 'Zone Vertisol Sud', type: 'Calcique', date: '2024-01-14', argile: '58%' },
        { id: 3, zone: 'Zone Vertisol Est', type: 'Gypsique', date: '2024-01-13', argile: '62%' }
      ]
    },
    reseauHydro: {
      title: '🌊 Réseau Hydrographique',
      icon: '🌊',
      color: '#06B6D4',
      stats: {
        total: dashboardStats.hydroNetwork || 0,
        coursEau: 45,
        longueur: '245km',
        bassins: 12
      },
      chartData: [
        { name: 'Oueds permanents', count: 15 },
        { name: 'Oueds temporaires', count: 25 },
        { name: 'Canaux', count: 8 },
        { name: 'Ruisseaux', count: 12 }
      ],
      recentData: [
        { id: 1, cours: 'Oued Bizerte', type: 'Permanent', date: '2024-01-15', longueur: '45km' },
        { id: 2, cours: 'Oued Sejnane', type: 'Temporaire', date: '2024-01-14', longueur: '32km' },
        { id: 3, cours: 'Canal Principal', type: 'Canal', date: '2024-01-13', longueur: '18km' }
      ]
    }
  };

  // Menu items pour la sidebar
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: '📊', active: true },
    { id: 'forage', label: 'Forages', icon: '⛏️' },
    { id: 'barrage', label: 'Barrages', icon: '🏗️' },
    { id: 'climat', label: 'Climat', icon: '🌤️' },
    { id: 'nappeProfonde', label: 'Nappes Profondes', icon: '💧' },
    { id: 'nappePhreatique', label: 'Nappes Phréatiques', icon: '🌊' },
    { id: 'geologie', label: 'Géologie', icon: '🪨' },
    { id: 'delegation', label: 'Délégation', icon: '🏛️' },
    { id: 'cnBizerte', label: 'Courbes de Niveau', icon: '📐' },
    { id: 'pedologie', label: 'Pédologie', icon: '🌱' },
    { id: 'vertisol', label: 'Vertisol', icon: '🟫' },
    { id: 'reseauHydro', label: 'Réseau Hydro', icon: '🌊' },
    { id: 'reports', label: 'Rapports', icon: '📈' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' }
  ];

  if (loading && Object.keys(dashboardStats).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Chargement des données</p>
          <p className="text-sm text-gray-500">Interrogation des APIs...</p>
        </div>
      </div>
    );
  }

  const currentSection = sectionData[selectedSection];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <span className="text-lg">💧</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-800">HydroTrack</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setSelectedSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                    selectedSection === item.id
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Utilisateur</p>
                <p className="text-xs text-gray-500">Administrateur</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">☰</span>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Dashboard Utilisateur</h1>
                <p className="text-sm text-gray-500">Gestion des ressources hydrologiques</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">U</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">Utilisateur Admin</p>
                    <p className="text-xs text-gray-500">En ligne</p>
                  </div>
                  <span className="text-gray-400">⌄</span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      👤 Mon Profil
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      ⚙️ Paramètres
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      🛟 Aide
                    </a>
                    <div className="border-t border-gray-200"></div>
                    <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      🚪 Déconnexion
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="px-6 py-2 bg-gray-50 border-t border-gray-200">
            <nav className="flex space-x-2 text-sm text-gray-600">
              <span>Accueil</span>
              <span>/</span>
              <span className="text-blue-600 font-medium">{currentSection.title}</span>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Last Updated */}
          {lastUpdated && (
            <div className="mb-4 text-sm text-gray-500">
              Dernière mise à jour: {lastUpdated.toLocaleTimeString()}
            </div>
          )}

          {/* Section Content */}
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(currentSection.stats).map(([key, value], index) => (
                <div 
                  key={key}
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
                    </div>
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${currentSection.color}15` }}
                    >
                      <span style={{ color: currentSection.color }}>{currentSection.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts and Data Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-800 text-lg">📊 Statistiques</h3>
                  <span className="text-sm text-gray-500">Distribution</span>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {selectedSection === 'climat' ? (
                      <LineChart data={currentSection.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="temp" 
                          stroke={currentSection.color} 
                          strokeWidth={2}
                          name="Température (°C)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="rain" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          name="Pluie (mm)"
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={currentSection.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="count" 
                          radius={[4, 4, 0, 0]}
                          fill={currentSection.color}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Data */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-800 text-lg">📝 Données Récentes</h3>
                  <span className="text-sm text-gray-500">Dernières entrées</span>
                </div>
                <div className="space-y-4">
                  {currentSection.recentData.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${currentSection.color}15` }}
                          >
                            <span style={{ color: currentSection.color }}>{currentSection.icon}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name || item.station || item.site || item.zone || item.cours}</p>
                            <p className="text-sm text-gray-500">
                              {item.date} • {item.status || item.level || item.formation || item.capacity || item.type || item.region}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {item.depth || item.temp || item.capacity || item.analyses || item.projets || item.lignes || item.longueur || item.altitude || item.pH || item.argile}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.depth ? 'Profondeur' : 
                           item.temp ? 'Température' : 
                           item.capacity ? 'Capacité' : 
                           item.analyses ? 'Analyses' :
                           item.projets ? 'Projets' :
                           item.lignes ? 'Lignes' :
                           item.longueur ? 'Longueur' :
                           item.altitude ? 'Altitude' :
                           item.pH ? 'pH' :
                           item.argile ? 'Argile' : 'Valeur'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800 text-lg">ℹ️ Informations {currentSection.title}</h3>
                <span className="text-sm text-gray-500">Détails techniques</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-600">📈</span>
                    <span className="font-medium text-blue-800">État Global</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {selectedSection === 'forage' && 'Situation stable avec 85% des forages opérationnels'}
                    {selectedSection === 'barrage' && 'Niveaux de remplissage moyens à 78%'}
                    {selectedSection === 'climat' && 'Conditions météorologiques normales pour la saison'}
                    {selectedSection === 'nappeProfonde' && 'Niveaux stables avec surveillance renforcée'}
                    {selectedSection === 'nappePhreatique' && 'Sensibilité aux variations saisonnières'}
                    {selectedSection === 'geologie' && 'Formations géologiques bien cartographiées'}
                    {selectedSection === 'delegation' && 'Couverture territoriale complète avec 24 régions'}
                    {selectedSection === 'cnBizerte' && 'Cartographie topographique précise et à jour'}
                    {selectedSection === 'pedologie' && 'Diversité des types de sols bien documentée'}
                    {selectedSection === 'vertisol' && 'Caractérisation des sols argileux avancée'}
                    {selectedSection === 'reseauHydro' && 'Réseau hydrographique bien entretenu et surveillé'}
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-600">🔍</span>
                    <span className="font-medium text-green-800">Surveillance</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {selectedSection === 'forage' && 'Monitoring en temps réel des débits et pressions'}
                    {selectedSection === 'barrage' && 'Contrôle quotidien des niveaux et débits'}
                    {selectedSection === 'climat' && 'Réseau de 25 stations météorologiques'}
                    {selectedSection === 'nappeProfonde' && 'Piezomètres automatisés avec alertes'}
                    {selectedSection === 'nappePhreatique' && 'Surveillance mensuelle des paramètres'}
                    {selectedSection === 'geologie' && 'Analyses régulières des échantillons'}
                    {selectedSection === 'delegation' && 'Suivi administratif et technique des projets'}
                    {selectedSection === 'cnBizerte' && 'Mises à jour cartographiques semestrielles'}
                    {selectedSection === 'pedologie' && 'Campagnes d\'échantillonnage saisonnières'}
                    {selectedSection === 'vertisol' && 'Analyses physico-chimiques régulières'}
                    {selectedSection === 'reseauHydro' && 'Surveillance des débits et qualité des eaux'}
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-yellow-600">⚠️</span>
                    <span className="font-medium text-yellow-800">Recommandations</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    {selectedSection === 'forage' && 'Maintenance préventive recommandée pour 12 forages'}
                    {selectedSection === 'barrage' && 'Vérification des vannes programmée pour Février'}
                    {selectedSection === 'climat' && 'Prévisions de précipitations pour la semaine prochaine'}
                    {selectedSection === 'nappeProfonde' && 'Surveillance renforcée des zones critiques'}
                    {selectedSection === 'nappePhreatique' && 'Échantillonnage complémentaire requis'}
                    {selectedSection === 'geologie' && 'Nouvelles campagnes de forage recommandées'}
                    {selectedSection === 'delegation' && 'Coordination renforcée entre les régions'}
                    {selectedSection === 'cnBizerte' && 'Mise à jour des zones en développement'}
                    {selectedSection === 'pedologie' && 'Études complémentaires sur l\'érosion'}
                    {selectedSection === 'vertisol' && 'Suivi de la compaction des sols'}
                    {selectedSection === 'reseauHydro' && 'Nettoyage des oueds avant la saison des pluies'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Chargement...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>Actualiser les Données</span>
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardUser;