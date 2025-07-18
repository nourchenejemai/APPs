import React, { useEffect, useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const TDSChart = () => {
  const [tdsValue, setTdsValue] = useState(0);     // actual value from API
  const [ecValue, setEcValue] = useState(0);       // actual value from API
  const [animatedTds, setAnimatedTds] = useState(0); // animated display value
  const [animatedEc, setAnimatedEc] = useState(0);   // animated display value

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/gettds');
      const json = await res.json();

      if (Array.isArray(json.data) && json.data.length > 0) {
        const latest = json.data.at(-1);
        setTdsValue(latest.tds || 0);
        setEcValue((latest.ec || 0) * 1000); // Scale EC for same gauge
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animate TDS
  useEffect(() => {
    const tdsInterval = setInterval(() => {
      setAnimatedTds((prev) => {
        if (Math.abs(prev - tdsValue) < 1) return tdsValue;
        return prev + (tdsValue - prev) * 0.1;
      });
    }, 50);
    return () => clearInterval(tdsInterval);
  }, [tdsValue]);

  // Animate EC
  useEffect(() => {
    const ecInterval = setInterval(() => {
      setAnimatedEc((prev) => {
        if (Math.abs(prev - ecValue) < 1) return ecValue;
        return prev + (ecValue - prev) * 0.1;
      });
    }, 50);
    return () => clearInterval(ecInterval);
  }, [ecValue]);

  return (
   
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* TDS */}
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="font-bold text-gray-700 mb-2">TDS (ppm)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={20}
              data={[{ name: 'TDS', value: animatedTds, fill: '#8884d8' }]}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise
                dataKey="value"
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-lg font-semibold text-indigo-600">
            {Math.round(animatedTds)} ppm
          </p>
        </div>

        {/* EC */}
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="font-bold text-gray-700 mb-2">EC (μS/cm)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={20}
              data={[{ name: 'EC', value: animatedEc, fill: '#82ca9d' }]}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise
                dataKey="value"
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-lg font-semibold text-green-600">
            {animatedEc.toFixed(0)} μS/cm
          </p>
        </div>
      </div>
    
  );
};

export default TDSChart;
