import React, { useState, useEffect } from 'react';

function DataDisplay() {
  const [postgresData, setPostgresData] = useState([]);
  const [mongoData, setMongoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostgresData = async () => {
      try {
        const response = await fetch('/api/postgres-data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPostgresData(data);
      } catch (error) {
        setError('Failed to fetch PostgreSQL data.');
        console.error('Error fetching PostgreSQL data:', error);
      }
    };

   

    fetchPostgresData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Data from PostgreSQL</h2>
      {postgresData.length > 0 ? (
        <ul>
          {postgresData.map(item => (
            <li key={item.id}> {/* Assuming your PostgreSQL table has an 'id' column */}
              {JSON.stringify(item)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available from PostgreSQL.</p>
      )}

     
    
    </div>
  );
}

export default DataDisplay;