import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  Legend,
  ReferenceLine,
} from "recharts";
import { Sun, Droplets, Thermometer, Waves, Gauge } from "lucide-react";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import TDSchart from "./TDSchart";

const SensorVisualization = () => {
  const [data, setData] = useState([]);
  const [tdsData, setTdsData] = useState([]);
  const [phData, setPhData] = useState([]);
  const [soilHumidityData, setSoilHumidityData] = useState([]);
  const [selectedChart, setSelectedChart] = useState("temperature");
  
  // Get current values
  const [currentPh, setCurrentPh] = useState(null);
  const [currentSoilHumidity, setCurrentSoilHumidity] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/get-sensor").then((res) => res.json()),
      fetch("http://localhost:8080/api/gettds").then((res) => res.json()),
      fetch("http://localhost:8080/api/getph").then((res) => res.json()),
      fetch("http://localhost:8080/api/gethumSol").then((res) => res.json()),
    ])
      .then(([sensorResp, tdsResp, phResp, humSolResp]) => {
        // Extract data from API responses
        const sensorArray = sensorResp.success ? sensorResp.data : (Array.isArray(sensorResp) ? sensorResp : []);
        const tdsArray = tdsResp.success ? tdsResp.data : (Array.isArray(tdsResp) ? tdsResp : []);
        const phArray = phResp.success ? phResp.data : (Array.isArray(phResp) ? phResp : []);
        const humSolArray = humSolResp.success ? humSolResp.data : (Array.isArray(humSolResp) ? humSolResp : []);

        // Set separate data for each chart
        setTdsData(tdsArray);
        setPhData(phArray);
        setSoilHumidityData(humSolArray);

        // Find the most recent soil humidity value
        if (humSolArray.length > 0) {
          // Sort by timestamp to get the most recent
          const sortedSoilHumidity = [...humSolArray].sort((a, b) => {
            const timeA = new Date(a.timestamp || a.time || 0);
            const timeB = new Date(b.timestamp || b.time || 0);
            return timeB - timeA;
          });
          setCurrentSoilHumidity(sortedSoilHumidity[0].soilHumidity || sortedSoilHumidity[0].value || sortedSoilHumidity[0].humidity );
        }

        // Create maps by timestamp for merging
        const tdsMap = new Map();
        tdsArray.forEach((d) => {
          const timestamp = d.timestamp || d.time;
          if (timestamp) tdsMap.set(timestamp, d.tds || d.value);
        });

        const phMap = new Map();
        phArray.forEach((p) => {
          const timestamp = p.timestamp || p.time;
          if (timestamp) phMap.set(timestamp, p.ph || p.value);
        });

        const humSolMap = new Map();
        humSolArray.forEach((h) => {
          const timestamp = h.timestamp || h.time;
          if (timestamp) humSolMap.set(timestamp, h.soilHumidity || h.value || h.humidity);
        });

        // Merge all data
        const merged = sensorArray.map((entry) => {
          const ts = entry.timestamp || entry.time;
          const timeFormatted = ts ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : '';
          
          return {
            time: timeFormatted,
            timestamp: ts,
            temperature: parseFloat(entry.temperature) || 0,
            humidity: parseFloat(entry.humidity) || 0,
            tds: tdsMap.get(ts) ? parseFloat(tdsMap.get(ts)) : null,
            ph: phMap.get(ts) ? parseFloat(phMap.get(ts)) : null,
            soilHumidity: humSolMap.get(ts) ? parseFloat(humSolMap.get(ts)) : null,
          };
        }).filter(item => item.timestamp);

        setData(merged.slice(-100));
      })
      .catch((err) => console.error("Failed to fetch data", err));
  }, []);

  // Calculate min and max values for better YAxis domains
  const tempValues = data.map(item => item.temperature).filter(val => !isNaN(val));
  const humidityValues = data.map(item => item.humidity).filter(val => !isNaN(val));
  const soilMoistureValues = soilHumidityData.map(item => 
    item.humidity || item.value || item.soilHumidity
  ).filter(val => !isNaN(val));
  const phValues = phData.map(item => item.ph || item.value).filter(val => !isNaN(val));
  
  const minTemp = tempValues.length ? Math.min(...tempValues) : 0;
  const maxTemp = tempValues.length ? Math.max(...tempValues) : 30;
  const minHumidity = humidityValues.length ? Math.min(...humidityValues) : 0;
  const maxHumidity = humidityValues.length ? Math.max(...humidityValues) : 100;
  const minSoilMoisture = soilMoistureValues.length ? Math.min(...soilMoistureValues) : 0;
  const maxSoilMoisture = soilMoistureValues.length ? Math.max(...soilMoistureValues) : 100;
  const minPh = phValues.length ? Math.min(...phValues) : 0;
  const maxPh = phValues.length ? Math.max(...phValues) : 9;

  // Format soil humidity data for chart
  const formattedSoilHumidityData = soilHumidityData.map(item => ({
    time: item.timestamp || item.time ? 
      new Date(item.timestamp || item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : '',
    humidity: item.soilHumidity || item.humidity || item.value,
    timestamp: item.timestamp
  })).filter(item => item.timestamp);
  //last value soil humidity
const latestSoilHumidity = soilHumidityData.length
  ? soilHumidityData.reduce((latest, current) => {
      const latestTime = new Date(latest.timestamp || latest.time).getTime();
      const currentTime = new Date(current.timestamp || current.time).getTime();
      return currentTime > latestTime ? current : latest;
    })
  : null;
  // Format pH data for chart
  const formattedPhData = phData.map(item => ({
    time: item.timestamp || item.time ? 
      new Date(item.timestamp || item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : '',
    ph: item.ph || item.value,
    timestamp: item.timestamp || item.time
  })).filter(item => item.timestamp);
  //last value ph data
  const latestPh = phData.length
  ? phData.reduce((latest, current) => {
      const latestTime = new Date(latest.timestamp || latest.time).getTime();
      const currentTime = new Date(current.timestamp || current.time).getTime();
      return currentTime > latestTime ? current : latest;
    })
  : null;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-700 font-semibold mb-2">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {`${entry.name}: ${entry.value}${entry.dataKey === 'temperature' ? '°C' : 
                entry.dataKey === 'ph' ? ' pH' : 
                entry.dataKey === 'humidity' ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      {/* Header Section */}
     <header className="bg-gradient-to-r from-blue-100 to-blue-300 text-blue py-4 pt-10">
  <div className="container mx-auto px-4">
    <div className="items-center justify-between mb-4">
    
      
      {/* Title in the center */}
      <div className="text-center">
        <h1 className="text-4xl md:text-3xl font-bold">Sensor Data Visualization</h1>
      </div>
      
      {/* Empty div for balance on the right */}
      <div className="flex-1"></div>
    </div>
    
    {/* Subtitle below the row */}
    <p className="text-xl max-w-2xl mx-auto text-center">
      Real-time monitoring of environmental parameters through IoT sensors
    </p>
  </div>
</header>

     

        {/* Chart Selection Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Select Chart Type</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => setSelectedChart("temperature")}
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                selectedChart === "temperature" 
                  ? "bg-orange-500 text-white shadow-lg transform scale-105" 
                  : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-orange-50"
              }`}
            >
              <Sun size={24} />
              <span className="font-semibold">Temperature</span>
            </button>
            <button
              onClick={() => setSelectedChart("humidity")}
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                selectedChart === "humidity" 
                  ? "bg-blue-500 text-white shadow-lg transform scale-105" 
                  : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-blue-50"
              }`}
            >
              <Droplets size={24} />
              <span className="font-semibold">Air Humidity</span>
            </button>
            <button
              onClick={() => setSelectedChart("soilHumidity")}
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                selectedChart === "soilHumidity" 
                  ? "bg-green-500 text-white shadow-lg transform scale-105" 
                  : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-green-50"
              }`}
            >
              <Thermometer size={24} />
              <span className="font-semibold">Soil Moisture</span>
            </button>
            <button
              onClick={() => setSelectedChart("ph")}
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                selectedChart === "ph" 
                  ? "bg-purple-500 text-white shadow-lg transform scale-105" 
                  : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-purple-50"
              }`}
            >
              <Waves size={24} />
              <span className="font-semibold">pH Level</span>
            </button>
            <button
              onClick={() => setSelectedChart("tds")}
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                selectedChart === "tds" 
                  ? "bg-red-500 text-white shadow-lg transform scale-105" 
                  : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-red-50"
              }`}
            >
              <Gauge size={24} />
              <span className="font-semibold">TDS/EC</span>
            </button>
          </div>
        </div>
         
        {/* Row 1: Temp & Humidity / TDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Temperature & Humidity Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedChart === "temperature" ? "Air Temperature" : "Air Humidity"}
                </h3>
                <p className="text-gray-600">Real-time monitoring</p>
              </div>
              <div className="flex gap-2">
                <button
                  className={`p-3 rounded-full transition-colors ${
                    selectedChart === "temperature" ? "bg-orange-100" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedChart("temperature")}
                >
                  <Sun className="w-6 h-6 text-orange-500" />
                </button>
                <button
                  className={`p-3 rounded-full transition-colors ${
                    selectedChart === "humidity" ? "bg-blue-100" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedChart("humidity")}
                >
                  <Droplets className="w-6 h-6 text-blue-500" />
                </button>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="time" 
                    interval={Math.floor(data.length / 10)} 
                    tick={{ fontSize: 12 }}
                   
                  />
                  <YAxis
                    domain={
                      selectedChart === "temperature"
                        ? [minTemp - 2, maxTemp + 2]
                        : [minHumidity - 5, maxHumidity + 5]
                    }
                   label={{
                    value: selectedChart === "temperature" ? "Temperature (°C)" : "Humidity (%)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 12 }
                  }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  {selectedChart === "temperature" ? (
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#ff5733" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: "#ff5733" }} 
                      activeDot={{ r: 6, stroke: "#ff5733", strokeWidth: 2, fill: "#fff" }} 
                      name="Temperature (°C)" 
                    />
                  ) : (
                    <Line 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#3498db" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: "#3498db" }} 
                      activeDot={{ r: 6, stroke: "#3498db", strokeWidth: 2, fill: "#fff" }} 
                      name="Humidity (%)" 
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Display current values */}
            {data.length > 0 && (
              <div className="mt-4 text-center">
                <div className="inline-block bg-gray-100 rounded-full px-6 py-3">
                  <span className="text-lg font-semibold text-gray-700">
                    Current:{" "}
                    {selectedChart === "temperature" ? (
                      <span className="text-orange-600">{data[data.length - 1].temperature}°C</span>
                    ) : (
                      <span className="text-blue-600">{data[data.length - 1].humidity}%</span>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>

       {/* TDS Chart */}
<div className="bg-white rounded-xl shadow-lg p-6">
  <div className="text-center mb-4 -mt-2"> {/* Added -mt-2 to move it up */}
    <h3 className="text-xl font-bold text-gray-800 mb-2">TDS/EC Levels</h3>
    <p className="text-gray-600">Total Dissolved Solids & Electrical Conductivity</p>
  </div>
  <div className="h-80">
    <TDSchart data={tdsData} />
  </div>
</div>
 </div>
        {/* Row 2: pH / Soil Moisture */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* pH Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                <Waves className="text-purple-500" /> pH Level Monitoring
              </h3>
              <p className="text-gray-600">Water acidity/alkalinity levels</p>
            </div>
            
            {/* Current pH Value */}
           {latestPh && (
            <div className="text-center mb-6">
              <div className="inline-block bg-purple-100 rounded-full p-6 shadow-md">
                <span className="text-4xl font-bold text-purple-700">
                  {latestPh.ph || latestPh.value}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">
                💧 pH Level: {latestPh.ph || latestPh.value} <br />
                <span className="text-gray-500 text-xs">
                  {new Date(latestPh.timestamp || latestPh.time).toLocaleTimeString('fr-FR', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    fractionalSecondDigits: 3
                  })}
                </span>
              </p>
            </div>
            )}
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedPhData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="time" 
                    interval={Math.floor(formattedPhData.length / 8)} 
                    tick={{ fontSize: 12 }}
                   
                  />
                  <YAxis domain={[minPh - 1, maxPh + 1]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="ph" 
                    stroke="#9B59B6" 
                    strokeWidth={3} 
                    dot={{ r: 3, fill: "#9B59B6" }} 
                    activeDot={{ r: 5, stroke: "#9B59B6", strokeWidth: 2, fill: "#fff" }} 
                    name="pH Level" 
                  />
                  
                  {/* Reference lines for pH levels */}
                  <ReferenceLine y={7} stroke="#10B981" strokeWidth={2} label="Neutral" />
                  <ReferenceLine y={4} stroke="#EF4444" strokeDasharray="3 3" label="Acidic" />
                  <ReferenceLine y={9} stroke="#3B82F6" strokeDasharray="3 3" label="Basic" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* pH Level Legend */}
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <span className="font-medium">Acidic (&lt;4.5)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span className="font-medium">Neutral (6-8)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="font-medium">Basic (&gt;9.5)</span>
              </div>
            </div>
          </div>

          {/* Soil Moisture Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                <Thermometer className="text-green-500" /> Soil Moisture Levels
              </h3>
              <p className="text-gray-600">Ground humidity monitoring</p>
            </div>
            
            {/* Current Soil Moisture Value */}
           {latestSoilHumidity && (
          <div className="text-center mb-6">
            <div className="inline-block bg-green-100 rounded-full p-6 shadow-md">
              <span className="text-4xl font-bold text-green-700">
                {latestSoilHumidity.soilHumidity || latestSoilHumidity.humidity || latestSoilHumidity.value}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2 font-medium">
              🌱 Humidité Sol: {latestSoilHumidity.soilHumidity || latestSoilHumidity.humidity || latestSoilHumidity.value}% <br />
              <span className="text-gray-500 text-xs">
                {new Date(latestSoilHumidity.timestamp || latestSoilHumidity.time).toLocaleTimeString('fr-FR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })}
              </span>
            </p>
          </div>
            )}
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedSoilHumidityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="time" 
                    interval={Math.floor(formattedSoilHumidityData.length / 8)} 
                    tick={{ fontSize: 12 }}
                    axisLine={true}
                    tickLine={true}
                  />
                  <YAxis 
                    domain={[minSoilMoisture - 5, maxSoilMoisture + 5]} 
                    tickCount={6}
                    axisLine={true}
                    tickLine={true}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Background gradient area */}
                  <defs>
                    <linearGradient id="soilGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2ECC71" stopOpacity={0.3}/>
                      <stop offset="100%" stopColor="#2ECC71" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  
                  {/* Area chart for the filled background */}
                  <Area 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="none" 
                    fill="url(#soilGradient)" 
                    activeDot={false}
                  />
                  
                  {/* Main line */}
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#2ECC71" 
                    strokeWidth={3} 
                    dot={{ r: 3, fill: "#2ECC71" }} 
                    activeDot={{ r: 5, stroke: "#2ECC71", strokeWidth: 2, fill: "#fff" }} 
                    name="Soil Moisture (%)" 
                  />
                  
                  {/* Reference lines for different moisture levels */}
                  <ReferenceLine y={20} stroke="#EF4444" strokeDasharray="3 3" label="Dry" />
                  <ReferenceLine y={40} stroke="#F59E0B" strokeDasharray="3 3" label="Optimal" />
                  <ReferenceLine y={80} stroke="#3B82F6" strokeDasharray="3 3" label="Too Wet" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend for moisture levels */}
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <span className="font-medium">Dry (&lt;20%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                <span className="font-medium">Optimal (20-80%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="font-medium">Too Wet (&gt;80%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default SensorVisualization;