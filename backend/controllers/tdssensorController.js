import { tdsModel } from "../models/TdsModel.js";
// POST /api/tds-data
export const createTDSData = async (req, res) => {
  try {
    const { timestamp, tds, ec} = req.body;

    const newTDSData = new tdsModel({ timestamp,tds, ec });
    await newTDSData.save();

    res.status(201).json({ success: true, message: 'Data stored successfully', data: newTDSData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tds-data
// controllers/tdssensorController.js
export const getTDSData = async (req, res) => {
  try {
    const data = await tdsModel.find().sort({ timestamp: 1 }); // fixed field name
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching TDS data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
