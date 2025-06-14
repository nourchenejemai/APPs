import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

function Dashboard() {
  const [forages, setForage] = useState([]);
  const [barrages, setBarrage] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/forages')
      .then((res) => res.json())
      .then((data) => setForage(data));

    fetch('http://localhost:8080/api/barrages')
      .then((res) => res.json())
      .then((data) => setBarrage(data));
  }, []);

  return (
        <div className="flex h-screen overflow-hidden">
      <Sidebar />

    <div className="p-4 space-y-10">
      <h2 className="text-2xl font-bold">📊 Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Forage Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">🧪 Forages by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={forages}>
              <XAxis dataKey="location" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Barrage Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">🌊 Barrage Capacities</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={barrages}
                dataKey="capacity"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              >
                {barrages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;
