import { SensorModel } from "../models/SensorModel.js";
// POST /api/sensor-data
export const createSensorData = async (req, res) => {
  try {
    const { timestamp, temperature, humidity} = req.body;

    const newSensorData = new SensorModel({ timestamp,temperature, humidity });
    await newSensorData.save();

    res.status(201).json({ success: true, message: 'Data stored successfully', data: newSensorData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/sensor-data
export const getSensorData = async (req, res) => {
  try {
    const data = await SensorModel.find().sort({ time: 1 }); 
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

