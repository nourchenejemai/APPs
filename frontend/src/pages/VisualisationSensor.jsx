import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceDot,
  Area,
  Legend,
} from "recharts";
import Navbar from "../components/home/Navbar";
import BackButton from "../components/BackButton";
import TDSchart from "./TDSchart";
import Phchart from "./capteurs/Phchart";

const VisualisationSensor = () => {
  const [data, setData] = useState([]);

 useEffect(() => {
    // Fetch both APIs simultaneously
    Promise.all([
      fetch("http://localhost:8080/api/getdata").then(res => res.json()),
      fetch("http://localhost:8080/api/getph").then(res => res.json()),
    ])
      .then(([dataResp, phResp]) => {
        const dataArray = dataResp.data || [];
        const phArray = phResp.data || [];

        // Create a map from ph data by timestamp for fast lookup
        const phMap = new Map();
        phArray.forEach((phEntry) => {
          phMap.set(phEntry.timestamp, phEntry.ph);
        });

        // Merge dataArray with ph values based on timestamp
        const merged = dataArray.map((entry) => {
          const phValue = phMap.get(entry.timestamp) ?? null;

          return {
            time: new Date(entry.timestamp).toLocaleTimeString([], {
              hour: "numeric",
              hour12: true,
            }),
            temperature: parseFloat(entry.temperature),
            humidity: parseFloat(entry.humidity),
            ph: phValue !== null ? parseFloat(phValue) : null,
          };
        });

        setData(merged);
      })
      .catch((err) => console.error("Failed to fetch data", err));
  }, []);


  const maxTemp = data.reduce(
    (max, d) => (d.temperature > max.temperature ? d : max),
    { temperature: -Infinity }
  );
  const minTemp = data.reduce(
    (min, d) => (d.temperature < min.temperature ? d : min),
    { temperature: Infinity }
  );

  return (
    <div className="w-full min-h-screen bg-blue-400 overflow-auto">
      <Navbar />
      <div className="pt-24 px-6 text-gray-800 h-full">
        <div className="absolute top-24 left-6">
          <BackButton />
        </div>
        <h2 className="text-3xl font-semibold text-center mb-10">
          Données Capteurs
        </h2>

        {/* Row 1: Temp & Humidity / TDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Temp & Humidity */}
          <div className="h-[450px] bg-white shadow-md rounded-xl p-4">
            <h3 className="text-lg font-bold mb-2 text-center">
              Température & Humidité
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <defs>
                  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e25822" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f0f0f0" stopOpacity={0.1} />
                  </linearGradient>
                </defs>

                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke={false}
                  fill="url(#bg)"
                  fillOpacity={0.3}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis
                  yAxisId="left"
                  domain={[15, 60]}
                  label={{
                    value: "Température (°C)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  label={{
                    value: "Humidité (%)",
                    angle: -90,
                    position: "insideRight",
                  }}
                />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ff5733"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Température"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#3498db"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                  name="Humidité"
                />
                {data.length > 0 && (
                  <>
                    <ReferenceDot
                      x={maxTemp.time}
                      y={maxTemp.temperature}
                      yAxisId="left"
                      label="H"
                      fill="#c0392b"
                      r={6}
                    />
                    <ReferenceDot
                      x={minTemp.time}
                      y={minTemp.temperature}
                      yAxisId="left"
                      label="L"
                      fill="#2ecc71"
                      r={6}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* TDS chart */}
          <div className="h-[450px] bg-white shadow-md rounded-xl p-4">
            <h3 className="text-lg font-bold mb-2 text-center">
              Surveillance de la qualité de l'eau (TDS)
            </h3>
            <TDSchart />
          </div>
        </div>

        {/* Row 2: pH / Soil Moisture */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

  {/* pH section */}
  <div className="h-[450px] bg-white shadow-md rounded-xl p-4">
      <div className="grid grid-cols-1 lg:grid-cols gap-4 h-full">

      {/* Graphique ligne 
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 14]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="ph"
              stroke="#9B59B6"
              name="pH"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>*/}

      {/* Jauge circulaire */}
        <Phchart />
      
    </div>
  </div>

  {/* Humidité du sol */}
  <div className="h-[450px] bg-white shadow-md rounded-xl p-4">
    <h3 className="text-lg font-bold mb-2 text-center">
      Humidité du Sol
    </h3>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="soilMoisture"
          stroke="#2ECC71"
          name="Humidité du Sol"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
    </div>
    </div>
  );
};

export default VisualisationSensor;
