import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

function Dashboard() {
  const [sensorData, setSensorData] = useState([]);
  const [barrages, setBarrages] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [forages, setForages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/sensors')
      .then(res => res.json())
      .then(data => setSensorData(data));

    fetch('http://localhost:8080/api/barrages')
      .then(res => res.json())
      .then(data => setBarrages(data));

    fetch('http://localhost:8080/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data));

    fetch('http://localhost:8080/api/forages')
      .then(res => res.json())
      .then(data => setForages(data));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 p-4 space-y-8 overflow-auto">
        <h1 className="text-2xl font-bold">💧 Water Resource Monitoring Dashboard</h1>

        {/* 🔹 1. Real-time Sensor Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded shadow p-4">
            <p className="text-gray-500">Température</p>
            <p className="text-xl font-bold">{sensorData[0]?.temperature ?? '--'} °C</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-gray-500">Humidité</p>
            <p className="text-xl font-bold">{sensorData[0]?.humidity ?? '--'} %</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-gray-500">TDS</p>
            <p className="text-xl font-bold">{sensorData[0]?.tds ?? '--'} ppm</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-gray-500">Niveau d’eau</p>
            <p className="text-xl font-bold">{sensorData[0]?.waterLevel ?? '--'} cm</p>
          </div>
        </div>

        {/* 🔹 2. Interactive Map Placeholder */}
        <div className="bg-white rounded shadow p-4 h-72">
          <h2 className="font-semibold mb-2">🗺️ Map of Sensor Locations</h2>
          <div className="bg-gray-200 h-full flex items-center justify-center text-gray-600">
            [ Map Component Placeholder - e.g., Leaflet ]
          </div>
        </div>

        {/* 🔹 3. Historical Data Graph */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">📈 Water Level Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sensorData}>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="waterLevel" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🔹 4. Barrage Capacities Pie Chart */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">🌊 Barrage Capacities</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={barrages}
                dataKey="capacity"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {barrages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🔹 5. Alerts Section */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">🚨 Alerts</h2>
          <ul className="space-y-1 text-sm">
            {alerts.length === 0 ? (
              <li className="text-gray-500">No current alerts.</li>
            ) : (
              alerts.map((alert, index) => (
                <li key={index} className="text-red-600">⚠️ {alert.message}</li>
              ))
            )}
          </ul>
        </div>

        {/* 🔹 6. Forage Management Table */}
        <div className="bg-white rounded shadow p-4 overflow-auto">
          <h2 className="font-semibold mb-2">📋 Forage Management</h2>
          
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
