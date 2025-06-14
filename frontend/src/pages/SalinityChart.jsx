import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const SalinityChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/salinity')
      .then(res => {
        const sortedData = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setData(sortedData);
      });
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="salinity" label={{ value: 'Salinité (ppt)', position: 'bottom' }} />
        <YAxis
          type="category"
          dataKey="timestamp"
          tickFormatter={tick => new Date(tick).toLocaleTimeString()}
          width={100}
        />
        <Tooltip />
        <Line type="monotone" dataKey="salinity" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalinityChart;
