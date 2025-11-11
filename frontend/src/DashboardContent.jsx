import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, ComposedChart
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];
const STATUS_COLORS = {
  normal: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444'
};

// Function to get status for different metrics
const getStatus = (type, value) => {
  switch(type) {
    case 'temperature':
      return value > 35 ? 'danger' : value > 30 ? 'warning' : 'normal';
    case 'humidity':
      return value < 30 ? 'danger' : value < 40 ? 'warning' : 'normal';
    case 'ph':
      return value < 6 || value > 8 ? 'danger' : value < 6.5 || value > 7.5 ? 'warning' : 'normal';
    case 'tds':
      return value > 1000 ? 'danger' : value > 800 ? 'warning' : 'normal';
    case 'ec':
      return value > 2000 ? 'danger' : value > 1500 ? 'warning' : 'normal';
    default:
      return 'normal';
  }
};

function DashboardContent({ 
  sensorData, 
  barrages, 
  alerts, 
  isLoading, 
  timeRange, 
  setTimeRange,
  stats,
  parameterData,
  selectedParameter,
  setSelectedParameter,
  highTempAlert,
  setHighTempAlert 
}) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard Overview</h1>
        <div className="flex space-x-2">
          {['day', 'week', 'month'].map(range => (
            <button
              key={range}
              className={`px-3 py-1 rounded-lg text-sm ${timeRange === range ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Temperature Stats */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Temperature</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.temperature.avg.toFixed(1)}°C</p>
              <p className="text-xs text-gray-500 mt-1">Min: {stats.temperature.min}°C | Max: {stats.temperature.max}°C</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600">🌡️</span>
            </div>
          </div>
        </div>

        {/* Humidity Stats */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Humidity</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.humidity.avg.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Min: {stats.humidity.min}% | Max: {stats.humidity.max}%</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600">💧</span>
            </div>
          </div>
        </div>

        {/* pH Stats */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">pH Level</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.ph.avg.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">Min: {stats.ph.min} | Max: {stats.ph.max}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600">🧪</span>
            </div>
          </div>
        </div>

        {/* TDS Stats */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">TDS</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.tds.avg.toFixed(0)} ppm</p>
              <p className="text-xs text-gray-500 mt-1">Min: {stats.tds.min} | Max: {stats.tds.max}</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <span className="text-indigo-600">🔬</span>
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Selection and Chart */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-700 flex items-center">
            <span className="mr-2">📈</span> Parameter Trends ({timeRange})
          </h2>
          <div className="flex space-x-2">
            {['temperature', 'humidity', 'ph', 'tds'].map(param => (
              <button
                key={param}
                className={`px-3 py-1 rounded-lg text-sm ${selectedParameter === param ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
                onClick={() => setSelectedParameter(param)}
              >
                {param.charAt(0).toUpperCase() + param.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={parameterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={selectedParameter} 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Combined Parameters Chart */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="font-semibold text-gray-700 mb-4 flex items-center">
          <span className="mr-2">📊</span> Combined Parameters
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={parameterData.slice(0, 12)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="tds" fill="#413ea0" name="TDS (ppm)" />
              <Line yAxisId="right" type="monotone" dataKey="ph" stroke="#ff7300" name="pH" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Barrage Capacities */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-semibold text-gray-700 flex items-center">
            <span className="mr-2">🌊</span> Barrage Capacities
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Pie chart aligned on the left */}
          <div className="lg:w-1/2 flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={barrages.filter(b => b.name).map(b => ({ ...b, value: 1 }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {barrages.filter(b => b.name).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _, props) => [
                    `${((value / barrages.filter(b => b.name).length) * 100).toFixed(0)}%`,
                    props.payload.name
                  ]}
                  contentStyle={{ borderRadius: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Barrage details on the right */}
          <div className="lg:w-1/2 mt-4 lg:mt-0 lg:pl-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Barrage Details</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {barrages.filter(b => b.name).length === 0 ? (
                <p className="text-gray-500 text-sm">No barrage data available</p>
              ) : (
                barrages.filter(b => b.name).map((barrage, index, arr) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm font-medium">{barrage.name}</span>
                    </div>
                    <div className="text-sm font-semibold">
                      {((1 / arr.length) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="mr-2">⚠️</span> Current Alerts
          </h3>
          
          {/* Critical Temperature Alert Banner */}
          {sensorData[0]?.temperature > 50 && (
            <div className="bg-red-600 text-white p-4 rounded-lg flex items-center justify-between animate-pulse mb-4">
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <div>
                  <h3 className="text-lg font-bold">CRITICAL TEMPERATURE ALERT</h3>
                  <p>Temperature has exceeded 50°C. Immediate action required!</p>
                  <p className="text-sm mt-1">Current temperature: {sensorData[0]?.temperature}°C</p>
                </div>
              </div>
              <button 
                className="bg-red-800 hover:bg-red-700 px-4 py-2 rounded-lg font-medium"
                onClick={() => setHighTempAlert(false)}
              >
                Acknowledge
              </button>
            </div>
          )}

          {/* All Alerts List */}
          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'danger' ? 'border-red-500 bg-red-50' : 
                    alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' : 
                    'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{alert.message}</span>
                      <span className="block text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.type === 'danger' ? 'bg-red-100 text-red-800' : 
                      alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-700">No active alerts. All systems are normal.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;