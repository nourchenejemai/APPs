import express from 'express';
import{createTDSData, getTDSData,getTDSCount ,modifyTds,deleteTdsById,getAllTds}from '../controllers/tdssensorController.js'

const TDSData =express.Router();

TDSData.post('/tds-data', createTDSData);
TDSData.get('/gettds', getTDSData);
TDSData.get('/tds/count',getTDSCount)
TDSData.put('/modifytds',modifyTds)
TDSData.delete('/deletetds/:id',deleteTdsById)
TDSData.get('/getalltds',getAllTds)



export default TDSData