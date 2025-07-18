import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import Navbar from '../components/home/Navbar';
import BackButton from '../components/BackButton';
import TDSchart from './TDSchart';

const VisualisationSensor = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/sensor-data', {
          withCredentials: true,
        });
        if (res.data.success) {
          const transformed = res.data.data.map(item => ({
            name: new Date(item.timestamp).toLocaleTimeString(),
            temperature: item.temperature,
            humidity: item.humidity,
            ph: item.ph, // Add pH value
            soilMoisture: item.soilMoisture // Add soil moisture value
          }));
          setChartData(transformed);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-blue-400 overflow-auto">
      <Navbar />
      <div className="pt-24 px-6 text-gray-800 h-full">
        <div className="absolute top-24 left-6">
          <BackButton />
        </div>
        <h2 className="text-3xl font-semibold text-center mb-10">Données Capteurs</h2>

        {/* First row: Temperature & Humidity | Water Salinity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="h-[450px] bg-white shadow-md rounded-xl p-4">
            <h3 className="text-lg font-bold mb-2 text-center">Température et Humidité</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#FF5733" name="Température (°C)" />
                <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#3498DB" name="Humidité (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[450px] bg-white shadow-md rounded-xl p-4">
            <h3 className="text-lg font-bold mb-2 text-center">Surveillance de la qualité de l'eau</h3>
            <TDSchart />
          </div>
        </div>

        {/* Second row: pH | Soil Moisture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* pH Chart */}
          <div className="h-[450px] bg-white shadow-md rounded-xl p-4">
            <h3 className="text-lg font-bold mb-2 text-center">Valeur du pH</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ph" stroke="#9B59B6" name="pH" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Soil Moisture Chart */}
          <div className="h-[450px] bg-white shadow-md rounded-xl p-4">
            <h3 className="text-lg font-bold mb-2 text-center">Humidité du Sol</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="soilMoisture" stroke="#2ECC71" name="Humidité du Sol (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualisationSensor;
