import express from 'express';
import{createSensorData, getSensorData, getSensorCount,modifySensor,deleteSensorById,getAllSensor }from '../controllers/sensorController.js'

const SensorData =express.Router();

SensorData.post('/save-sensor', createSensorData);
SensorData.get('/get-sensor', getSensorData);
SensorData.get('/sensor/count',getSensorCount)
SensorData.put('/modifysensor',modifySensor)
SensorData.delete('/deletesensor/:id',deleteSensorById)
SensorData.get('/getallsensor',getAllSensor)



export default SensorData