import express from 'express';
import {createSolData,gethumSolData,getSolCount,modifySol,deleteSolById,getAllSol} from '../controllers/solsensorController.js'

const SolData = express.Router();
SolData.post('/sol-data',createSolData);
SolData.get('/gethumSol',gethumSolData);
SolData.get('/soil/count',getSolCount)
SolData.put('/modifysol',modifySol)
SolData.delete('/deletesol/:id',deleteSolById)
SolData.get('/getallsol',getAllSol)

export default SolData;