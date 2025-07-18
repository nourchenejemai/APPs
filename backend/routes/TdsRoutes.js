import express from 'express';
import{createTDSData, getTDSData }from '../controllers/tdssensorController.js'

const TDSData =express.Router();

TDSData.post('/tds-data', createTDSData);
TDSData.get('/gettds', getTDSData);



export default TDSData