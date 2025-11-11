import express from 'express';
import { createPhData,getPhData,getPhCount,modifyPh,deletePhById,getAllPh } from '../controllers/phsensorController.js';


const PhData = express.Router();
PhData.post('/ph-data',createPhData);
PhData.get('/getph',getPhData);
PhData.get('/ph/count',getPhCount)
PhData.put('/modifyph',modifyPh)
PhData.delete('/deleteph/:id',deletePhById)
PhData.get('/getallph',getAllPh)


export default PhData;
