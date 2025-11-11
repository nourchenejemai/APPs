import { tdsModel } from "../models/TdsModel.js";

// POST /api/tds-data
export const createTDSData = async (req, res) => {
  try {
    const { timestamp, tds, ec } = req.body;

    const newTDSData = new tdsModel({ timestamp, tds, ec });
    await newTDSData.save();

    res.status(201).json({ success: true, message: 'Data stored successfully', data: newTDSData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/gettds
export const getTDSData = async (req, res) => {
  try {
    const data = await tdsModel.find().sort({ timestamp: 1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching TDS data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tds-count
export const getTDSCount = async (req, res) => {
  try {
    const count = await tdsModel.countDocuments();
    res.status(200).json({ 
      success: true, 
      count,
      message: `Total TDS records: ${count}`
    });
  } catch (error) {
    console.error("Error counting TDS data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/all-tds
export const getAllTds = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'timestamp', order = 'desc' } = req.query;
    
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    const data = await tdsModel.find()
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await tdsModel.countDocuments();

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
    console.error("Error getting all TDS data:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des données TDS"
    });
  }
}

// DELETE /api/delete-tds/:id
export const deleteTdsById = async (req, res) => {
  try {
    const { id } = req.params;

    const tdsData = await tdsModel.findById(id);
    if (!tdsData) {
      return res.status(404).json({
        success: false,
        message: "Donnée TDS non trouvée"
      });
    }

    await tdsModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Donnée TDS supprimée avec succès",
      deletedData: {
        id: tdsData._id,
        timestamp: tdsData.timestamp,
        tds: tdsData.tds,
        ec: tdsData.ec
      }
    });
  } catch (error) {
    console.error("Error deleting TDS data:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la donnée TDS"
    });
  }
}

// PUT /api/modify-tds/:id
export const modifyTds = async (req, res) => {
  try {
    const { id } = req.params;
    const { timestamp, tds, ec } = req.body;

    // Vérifier si la donnée existe
    const existingData = await tdsModel.findById(id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: "Donnée TDS non trouvée"
      });
    }

    // Préparer les champs à mettre à jour
    const updateFields = {};
    if (timestamp) updateFields.timestamp = timestamp;
    if (tds !== undefined) updateFields.tds = tds;
    if (ec !== undefined) updateFields.ec = ec;

    // Mettre à jour la donnée
    const updatedData = await tdsModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Donnée TDS modifiée avec succès",
      data: updatedData
    });
  } catch (error) {
    console.error("Error modifying TDS data:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la modification de la donnée TDS"
    });
  }
}