import { useEffect, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from 'recharts';
import axios from 'axios';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const DashboardOverview = () => {
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedSensorData, setSelectedSensorData] = useState('temperature');

  // Données simulées pour les capteurs
  const sensorStats = {
    temperature: {
      avg: 23.5,
      min: 18.2,
      max: 29.8,
      unit: '°C',
      icon: '🌡️',
      color: '#EF4444',
      data: [
        { time: '00:00', value: 19.2 },
        { time: '04:00', value: 18.2 },
        { time: '08:00', value: 21.5 },
        { time: '12:00', value: 26.8 },
        { time: '16:00', value: 29.8 },
        { time: '20:00', value: 24.3 }
      ]
    },
    ph: {
      avg: 7.2,
      min: 6.8,
      max: 7.6,
      unit: 'pH',
      icon: '🧪',
      color: '#10B981',
      data: [
        { time: '00:00', value: 7.1 },
        { time: '04:00', value: 7.0 },
        { time: '08:00', value: 7.2 },
        { time: '12:00', value: 7.4 },
        { time: '16:00', value: 7.6 },
        { time: '20:00', value: 7.3 }
      ]
    },
    tds: {
      avg: 450,
      min: 320,
      max: 580,
      unit: 'ppm',
      icon: '🔬',
      color: '#3B82F6',
      data: [
        { time: '00:00', value: 380 },
        { time: '04:00', value: 320 },
        { time: '08:00', value: 420 },
        { time: '12:00', value: 520 },
        { time: '16:00', value: 580 },
        { time: '20:00', value: 480 }
      ]
    },
    soilMoisture: {
      avg: 65,
      min: 45,
      max: 85,
      unit: '%',
      icon: '💧',
      color: '#06B6D4',
      data: [
        { time: '00:00', value: 60 },
        { time: '04:00', value: 55 },
        { time: '08:00', value: 45 },
        { time: '12:00', value: 70 },
        { time: '16:00', value: 85 },
        { time: '20:00', value: 75 }
      ]
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fonction utilitaire améliorée pour extraire les données
  const extractCount = (response, endpoint) => {
    if (!response || !response.data) return 0;

    const data = response.data;
    console.log(`${endpoint} response:`, data);

    // Si c'est un nombre direct (MongoDB)
    if (typeof data === 'number') {
      return data;
    }

    // Si c'est un objet (PostgreSQL)
    if (typeof data === 'object') {
      // Essayer différentes clés possibles
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

      // Si c'est un objet avec success et une clé total
      if (data.success) {
        for (const key in data) {
          if (key !== 'success' && typeof data[key] === 'number') {
            console.log(`✅ ${endpoint}: found success with key "${key}" = ${data[key]}`);
            return data[key];
          }
        }
      }

      // Si c'est un array, retourner la longueur
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
      
      // Liste des endpoints
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

      console.log('🚀 Starting API calls...');

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

      // Construire les stats finales
      const stats = {};
      results.forEach(({ key, count }) => {
        stats[key] = count;
      });

      console.log('📊 Raw counts from APIs:', stats);

      // Mapper les clés avec les bonnes valeurs
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

      // Calculer les totaux
      mappedStats.waterResources = mappedStats.forages + mappedStats.cnBizerte + mappedStats.pedology;
      mappedStats.environmentalData = mappedStats.climate + mappedStats.geology + mappedStats.barrages + mappedStats.vertisol;
      mappedStats.sensorReadings = mappedStats.sensorData + mappedStats.tdsData + mappedStats.phData + mappedStats.soilHumidityData;
      mappedStats.total = Object.values(mappedStats).reduce((sum, count) => sum + count, 0);

      console.log('🎊 FINAL DASHBOARD STATS:', mappedStats);
      
      setDashboardStats(mappedStats);
      setLastUpdated(new Date());

    } catch (error) {
      console.error('💀 Error in fetchDashboardData:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Préparer les données pour les graphiques
  const waterResourcesData = [
    { name: 'Forages', value: dashboardStats.forages || 0, color: '#3B82F6' },
    { name: 'Courbe de niveau', value: dashboardStats.cnBizerte || 0, color: '#10B981' },
    { name: 'Pedologie', value: dashboardStats.pedology || 0, color: '#06B6D4' }
  ].filter(item => item.value > 0);

  const environmentalData = [
    { name: 'Climat', value: dashboardStats.climate || 0, color: '#F59E0B' },
    { name: 'Géologie', value: dashboardStats.geology || 0, color: '#EF4444' },
    { name: 'Vertisol', value: dashboardStats.vertisol || 0, color: '#F97316' },
    { name: 'Barrages', value: dashboardStats.barrages || 0, color: '#8B5CF6' },
  ].filter(item => item.value > 0);

  const nappesData = [
    { name: 'Nappes Phréatiques', value: dashboardStats.phreaticAquifers || 0, color: '#06B6D4' },
    { name: 'Nappes Profondes', value: dashboardStats.deepAquifers || 0, color: '#8B5CF6' }
  ].filter(item => item.value > 0);

  const mainStatsData = [
    { 
      name: 'Utilisateurs', 
      value: dashboardStats.users || 0, 
      icon: '👥', 
      color: '#3B82F6',
      description: 'Utilisateurs système'
    },
    { 
      name: 'Forages', 
      value: dashboardStats.forages || 0, 
      icon: '⛏️', 
      color: '#10B981',
      description: 'Points de forage'
    },
    { 
      name: 'Barrages', 
      value: dashboardStats.barrages || 0, 
      icon: '🏗️', 
      color: '#F59E0B',
      description: 'Structures hydrauliques'
    },
    { 
      name: 'Données Capteurs', 
      value: dashboardStats.sensorReadings || 0, 
      icon: '📡', 
      color: '#EF4444',
      description: 'Mesures totales'
    }
  ];

  const dataStatsData = [
    { 
      name: 'Données Capteurs', 
      value: dashboardStats.sensorData || 0, 
      icon: '📊', 
      color: '#3B82F6',
      trend: '+12%'
    },
    { 
      name: 'Mesures TDS', 
      value: dashboardStats.tdsData || 0, 
      icon: '🔬', 
      color: '#10B981',
      trend: '+8%'
    },
    { 
      name: 'Mesures pH', 
      value: dashboardStats.phData || 0, 
      icon: '🧪', 
      color: '#F59E0B',
      trend: '+5%'
    },
    { 
      name: 'Humidité Sol', 
      value: dashboardStats.soilHumidityData || 0, 
      icon: '🌱', 
      color: '#84CC16',
      trend: '+15%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Monitoring and analysis of water resources
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
            {['overview', 'distribution', 'analytics'].map(chart => (
              <button
                key={chart}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChart === chart 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedChart(chart)}
              >
                {chart === 'overview' && '📊 Aperçu'}
                {chart === 'distribution' && '📈 Distribution'}
                {chart === 'analytics' && '🔍 Analytique'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainStatsData.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div 
                  className="p-3 rounded-xl text-2xl"
                  style={{ 
                    backgroundColor: `${stat.color}15`,
                    border: `2px solid ${stat.color}30`
                  }}
                >
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                </div>
              </div>
              <div 
                className="h-1 rounded-full mt-4"
                style={{ backgroundColor: stat.color }}
              ></div>
            </div>
          ))}
        </div>

        {/* Data Collection Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {dataStatsData.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {stat.trend}
                </span>
              </div>
              <p className="text-gray-500 text-xs font-medium">{stat.name}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{stat.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      {selectedChart === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resource Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800 text-lg">📈 Distribution des Ressources en Eau</h3>
                <span className="text-sm text-gray-500">Total: {dashboardStats.waterResources?.toLocaleString()}</span>
              </div>
              <div className="h-80">
                {waterResourcesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={waterResourcesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {waterResourcesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Aucune donnée disponible
                  </div>
                )}
              </div>
            </div>

            {/* Environmental Data */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800 text-lg">🌿 Données Environnementales</h3>
                <span className="text-sm text-gray-500">Total: {dashboardStats.environmentalData?.toLocaleString()}</span>
              </div>
              <div className="h-80">
                {environmentalData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={environmentalData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="value"
                      >
                        {environmentalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Aucune donnée disponible
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Charts for Nappes and Climate */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nappes Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800 text-lg">💧 Détails des Nappes d'Eau</h3>
                <span className="text-sm text-gray-500">
                  Total: {(dashboardStats.phreaticAquifers + dashboardStats.deepAquifers)?.toLocaleString()}
                </span>
              </div>
              <div className="h-80">
                {nappesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={nappesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="value"
                      >
                        {nappesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Aucune donnée disponible
                  </div>
                )}
              </div>
            </div>

            {/* Climate and Soil Data - MODIFIÉ */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800 text-lg">🌤️ Données Capteurs</h3>
                <span className="text-sm text-gray-500">
                  Mesures en temps réel
                </span>
              </div>

              {/* Boutons de sélection */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(sensorStats).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSensorData(key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedSensorData === key 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sensorStats[key].icon} {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>

           
              {/* Graphique pour les données sélectionnées */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sensorStats[selectedSensorData].data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={sensorStats[selectedSensorData].color}
                      fill={sensorStats[selectedSensorData].color}
                      fillOpacity={0.2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={sensorStats[selectedSensorData].color}
                      strokeWidth={2}
                      dot={{ fill: sensorStats[selectedSensorData].color, strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 lg:col-span-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">Résumé de la Base de Données</h3>
              <p className="text-4xl font-bold mb-2">{dashboardStats.total?.toLocaleString()}</p>
              <p className="text-blue-100 text-sm">
                Enregistrements totaux • {dashboardStats.barrages?.toLocaleString()} barrages • {dashboardStats.forages?.toLocaleString()} forages
                • {dashboardStats.phreaticAquifers?.toLocaleString()} nappes phréatiques • {dashboardStats.deepAquifers?.toLocaleString()} nappes profondes
              </p>
            </div>
            <div className="text-5xl opacity-80">🌍</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="text-center">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
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
            <p className="text-xs text-gray-500 mt-2">
              Dernière mise à jour: {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;