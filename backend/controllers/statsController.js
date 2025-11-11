import { pool } from '../config/postgres.js';

// Get real counts from database
export const getDashboardStats = async (req, res) => {
  try {
    // Count users
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    
    // Count forages
    const foragesCount = await pool.query('SELECT COUNT(*) FROM forages');
    
    // Count barrages
    const barragesCount = await pool.query('SELECT COUNT(*) FROM barrage');
    
    // Count phreatic aquifers
    const nappesCount = await pool.query('SELECT COUNT(*) FROM nappe_phreatique');
    
    // Count deep aquifers
    const nappesProCount = await pool.query('SELECT COUNT(*) FROM nappe_profonde');
    
    // Count climate stations
    const climatCount = await pool.query('SELECT COUNT(*) FROM climat');
    
    // Count delegations
    const delegationCount = await pool.query('SELECT COUNT(*) FROM delegation');
    
    // Count geology data
    const geologieCount = await pool.query('SELECT COUNT(*) FROM geologie');
    
    // Count CN Bizerte data
    const cnbzCount = await pool.query('SELECT COUNT(*) FROM cn_bizerte');
    
    // Count pedology data
    const pedologieCount = await pool.query('SELECT COUNT(*) FROM pedologie');
    
    // Count vertisol data
    const vertisolCount = await pool.query('SELECT COUNT(*) FROM vertisol');
    
    // Count hydro network
    const reseauCount = await pool.query('SELECT COUNT(*) FROM reseau_hydro');

    // Count sensor data entries
    const sensorDataCount = await pool.query('SELECT COUNT(*) FROM sensor_data');
    
    // Count TDS data
    const tdsDataCount = await pool.query('SELECT COUNT(*) FROM tds_data');
    
    // Count pH data
    const phDataCount = await pool.query('SELECT COUNT(*) FROM ph_data');
    
    // Count soil humidity data
    const soilHumidityCount = await pool.query('SELECT COUNT(*) FROM soil_humidity_data');

    const stats = {
      users: parseInt(usersCount.rows[0].count),
      forages: parseInt(foragesCount.rows[0].count),
      barrages: parseInt(barragesCount.rows[0].count),
      phreaticAquifers: parseInt(nappesCount.rows[0].count),
      deepAquifers: parseInt(nappesProCount.rows[0].count),
      climate: parseInt(climatCount.rows[0].count),
      delegation: parseInt(delegationCount.rows[0].count),
      geology: parseInt(geologieCount.rows[0].count),
      cnBizerte: parseInt(cnbzCount.rows[0].count),
      pedology: parseInt(pedologieCount.rows[0].count),
      vertisol: parseInt(vertisolCount.rows[0].count),
      hydroNetwork: parseInt(reseauCount.rows[0].count),
      sensorData: parseInt(sensorDataCount.rows[0].count),
      tdsData: parseInt(tdsDataCount.rows[0].count),
      phData: parseInt(phDataCount.rows[0].count),
      soilHumidityData: parseInt(soilHumidityCount.rows[0].count)
    };

    // Calculate total
    stats.total = Object.values(stats).reduce((sum, count) => sum + count, 0);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch dashboard statistics' 
    });
  }
};

// Get real-time sensor statistics
export const getSensorStats = async (req, res) => {
  try {
    // Latest temperature
    const latestTemp = await pool.query(`
      SELECT temperature, timestamp 
      FROM sensor_data 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);

    // Latest humidity
    const latestHumidity = await pool.query(`
      SELECT humidity, timestamp 
      FROM sensor_data 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);

    // Latest pH
    const latestPH = await pool.query(`
      SELECT ph, timestamp 
      FROM ph_data 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);

    // Latest TDS
    const latestTDS = await pool.query(`
      SELECT tds, timestamp 
      FROM tds_data 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);

    // Average values today
    const todayAverages = await pool.query(`
      SELECT 
        AVG(temperature) as avg_temperature,
        AVG(humidity) as avg_humidity
      FROM sensor_data 
      WHERE DATE(timestamp) = CURRENT_DATE
    `);

    res.json({
      success: true,
      sensorStats: {
        currentTemperature: latestTemp.rows[0]?.temperature || 0,
        currentHumidity: latestHumidity.rows[0]?.humidity || 0,
        currentPH: latestPH.rows[0]?.ph || 0,
        currentTDS: latestTDS.rows[0]?.tds || 0,
        avgTemperatureToday: todayAverages.rows[0]?.avg_temperature || 0,
        avgHumidityToday: todayAverages.rows[0]?.avg_humidity || 0,
        lastUpdate: latestTemp.rows[0]?.timestamp || new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching sensor stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch sensor statistics' 
    });
  }
};