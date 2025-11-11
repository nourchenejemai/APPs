import React, { useEffect, useState } from 'react';
import { Gauge } from 'lucide-react';

const TDSChart = ({ data }) => {
  const [currentData, setCurrentData] = useState({ tds: 0, ec: 0 });
  const [animatedTds, setAnimatedTds] = useState(0);
  const [animatedEc, setAnimatedEc] = useState(0);
const tdsValues = data
  .map(d => Number(d.tds))
  .filter(v => v !== null && v !== undefined && !isNaN(v));

const ecValues = data
  .map(d => Number(d.ec))
  .filter(v => v !== null && v !== undefined && !isNaN(v));
  // Function to determine TDS status
  const getTdsStatus = (value) => {
    if (!value) return { status: "N/A", color: "#9CA3AF", level: 0 };
    if (value < 300) return { status: "Low", color: "#2ea61e", level: value/300 };
    if (value >= 300 && value <= 600) return { status: "Optimal", color: "#e07e3d", level: 0.3 + ((value-300)/600)*0.4 };
    return { status: "High", color: "#EF4444", level: 0.7 + (Math.min(value, 2000)-600)/1200*0.3 };
  };

  // Function to determine EC status
  const getEcStatus = (value) => {
    if (!value) return { status: "N/A", color: "#9CA3AF", level: 0 };
    if (value < 500) return { status: "Low", color: "#2ea61e", level: value/600 };
    if (value >= 500 && value <= 1500) return { status: "Optimal", color: "#e07e3d", level: 0.3 + ((value-500)/1000)*0.4 };
    return { status: "High", color: "#EF4444", level: 0.7 + (Math.min(value, 3200)-1500)/1500*0.3 };
  };

  // Update current data when props change
  useEffect(() => {
    if (data && data.length > 0) {
      const latest = data[data.length - 1];
      setCurrentData({
        tds: latest.tds || 0,
        ec: latest.ec || 0
      });
    }
  }, [data]);

  // Animate TDS
  useEffect(() => {
    const tdsInterval = setInterval(() => {
      setAnimatedTds((prev) => {
        if (Math.abs(prev - currentData.tds) < 1) return currentData.tds;
        return prev + (currentData.tds - prev) * 0.1;
      });
    }, 50);
    return () => clearInterval(tdsInterval);
  }, [currentData.tds]);

  // Animate EC
  useEffect(() => {
    const ecInterval = setInterval(() => {
      setAnimatedEc((prev) => {
        if (Math.abs(prev - currentData.ec) < 1) return currentData.ec;
        return prev + (currentData.ec - prev) * 0.1;
      });
    }, 50);
    return () => clearInterval(ecInterval);
  }, [currentData.ec]);

  const tdsStatus = getTdsStatus(animatedTds);
  const ecStatus = getEcStatus(animatedEc);

  return (
    <div className="h-full flex flex-col">
      {/* Header - More compact */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <Gauge className="text-red-500" size={20} />
        <h3 className="text-lg font-bold">TDS and Conductivity</h3>
      </div>
      
      {/* Current Values with Circular Gauges - Smaller */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* TDS Gauge */}
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <h4 className="text-xs text-gray-600 mb-1">TDS (ppm)</h4>
          <div className="relative w-24 h-24 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={tdsStatus.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${tdsStatus.level * 339} 339`}
                transform="rotate(-90 60 60)"
              />
              <text
                x="60"
                y="65"
                textAnchor="middle"
                fontSize="18"
                fontWeight="bold"
                fill={tdsStatus.color}
              >
                {Math.round(animatedTds)}
              </text>
              <text
                x="60"
                y="85"
                textAnchor="middle"
                fontSize="10"
                fill="#6B7280"
              >
                ppm
              </text>
            </svg>
          </div>
          <p className="text-xs font-medium mt-1" style={{ color: tdsStatus.color }}>
            {tdsStatus.status}
          </p>
        </div>
        
        {/* EC Gauge */}
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <h4 className="text-xs text-gray-600 mb-1">Conductivity (μS/cm)</h4>
          <div className="relative w-24 h-24 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={ecStatus.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${ecStatus.level * 339} 339`}
                transform="rotate(-90 60 60)"
              />
              <text
                x="60"
                y="65"
                textAnchor="middle"
                fontSize="18"
                fontWeight="bold"
                fill={ecStatus.color}
              >
                {Math.round(animatedEc)}
              </text>
              <text
                x="60"
                y="85"
                textAnchor="middle"
                fontSize="10"
                fill="#6B7280"
              >
                μS/cm
              </text>
            </svg>
          </div>
          <p className="text-xs font-medium mt-1" style={{ color: ecStatus.color }}>
            {ecStatus.status}
          </p>
        </div>
      </div>
        {/* Historical Data - More compact */}
      {data && data.length > 0 && (
        <div className="bg-white p-2 rounded-lg border">
          <h4 className="text-xs font-semibold text-center mb-1">Value History</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-600">TDS Min/Max:</p>
              <p className="text-sm font-medium">
                {tdsValues.length 
                  ? `${Math.min(...tdsValues).toFixed(0)} - ${Math.max(...tdsValues).toFixed(0)} ppm`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">EC Min/Max:</p>
              <p className="text-sm font-medium">
                {ecValues.length 
                  ? `${Math.min(...ecValues).toFixed(0)} - ${Math.max(...ecValues).toFixed(0)} μS/cm`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reference Values - More compact */}
      <div className="bg-gray-50 p-2 rounded-lg mb-2">
        <h4 className="text-xs font-semibold text-center mb-1">Reference Values</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="font-medium text-gray-700 text-xs">TDS:</p>
            <p className="text-gray-600 text-xs">Low (&lt;300 ppm)</p>
            <p className="text-gray-600 text-xs">Optimal (300-600 ppm)</p>
            <p className="text-gray-600 text-xs">High (&gt;600 ppm)</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 text-xs">Conductivity:</p>
            <p className="text-gray-600 text-xs">Low (&lt;500 μS/cm)</p>
            <p className="text-gray-600 text-xs">Optimal (500-1500 μS/cm)</p>
            <p className="text-gray-600 text-xs">High (&gt;1500 μS/cm)</p>
          </div>
        </div>
      </div>
      
    
    </div>
  );
};

export default TDSChart;