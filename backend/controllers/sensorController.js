import { SensorModel } from "../models/SensorModel.js";

// POST /api/save-sensor
export const createSensorData = async (req, res) => {
  try {
    const { timestamp, temperature, humidity } = req.body;

    const newSensorData = new SensorModel({ timestamp, temperature, humidity });
    await newSensorData.save();

    res.status(201).json({ success: true, message: 'Data stored successfully', data: newSensorData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/get-sensor
export const getSensorData = async (req, res) => {
  try {
    const data = await SensorModel.find().sort({ time: 1 }); 
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/sensor-count
export const getSensorCount = async (req, res) => {
  try {
    const count = await SensorModel.countDocuments();
    
    res.status(200).json({
      success: true,
      count,
      message: `Total des données de capteur: ${count}`
    });
  } catch (error) {
    console.error("Error counting sensor data:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du comptage des données de capteur"
    });
  }
};

// GET /api/all-sensor
export const getAllSensor = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'timestamp', order = 'desc' } = req.query;
    
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    const data = await SensorModel.find()
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SensorModel.countDocuments();

    res.status(200).json({
      success: true,
      data,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error getting all sensor data:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des données de capteur"
    });
  }
}

// DELETE /api/delete-sensor/:id
export const deleteSensorById = async (req, res) => {
  try {
    const { id } = req.params;

    const sensorData = await SensorModel.findById(id);
    if (!sensorData) {
      return res.status(404).json({
        success: false,
        message: "Donnée de capteur non trouvée"
      });
    }

    await SensorModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Donnée de capteur supprimée avec succès",
      deletedData: {
        id: sensorData._id,
        timestamp: sensorData.timestamp,
        temperature: sensorData.temperature,
        humidity: sensorData.humidity
      }
    });
  } catch (error) {
    console.error("Error deleting sensor data:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la donnée de capteur"
    });
  }
}

// PUT /api/modify-sensor/:id
export const modifySensor = async (req, res) => {
  try {
    const { id } = req.params;
    const { timestamp, temperature, humidity } = req.body;

    // Vérifier si la donnée existe
    const existingData = await SensorModel.findById(id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: "Donnée de capteur non trouvée"
      });
    }

    // Préparer les champs à mettre à jour
    const updateFields = {};
    if (timestamp) updateFields.timestamp = timestamp;
    if (temperature !== undefined) updateFields.temperature = temperature;
    if (humidity !== undefined) updateFields.humidity = humidity;

    // Mettre à jour la donnée
    const updatedData = await SensorModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Donnée de capteur modifiée avec succès",
      data: updatedData
    });
  } catch (error) {
    console.error("Error modifying sensor data:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la modification de la donnée de capteur"
    });
  }
}