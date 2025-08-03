import express from 'express';
import { createPhData,getPhData } from '../controllers/phsensorController.js';


const PhData = express.Router();
PhData.post('/ph-data',createPhData);
PhData.get('/getph',getPhData);


export default PhData;
