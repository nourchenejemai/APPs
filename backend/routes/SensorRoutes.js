import express from 'express';
import{createSensorData, getSensorData }from '../controllers/sensorController.js'

const SensorData =express.Router();

SensorData.post('/sensor-data', createSensorData);
SensorData.get('/getdata', getSensorData);



export default SensorData