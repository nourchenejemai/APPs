import express from 'express';
import{createSensorData, getSensorData }from '../controllers/sensorController.js'

const SensorData =express.Router();

SensorData.post('/sensor-data', createSensorData);
SensorData.get('/sensor-data', getSensorData);



export default SensorData