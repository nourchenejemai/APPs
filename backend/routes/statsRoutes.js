import express from 'express';
import {
  getDashboardStats,
  getStatsByType,
  getTimeSeriesStats,
  getSensorStats
} from '../controllers/statsController.js';

const router = express.Router();

router.get('/dashboard', getDashboardStats);
router.get('/by-type', getStatsByType);
router.get('/time-series', getTimeSeriesStats);
router.get('/sensor-stats', getSensorStats);

export default router;