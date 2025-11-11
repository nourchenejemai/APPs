import { SolModel } from "../models/SolhumModel.js";

// POST /api/sol-data
export const createSolData = async (req, res) => {
    try {
        const { timestamp, soilHumidity } = req.body;
        const newSolData = new SolModel({ timestamp, soilHumidity });
        await newSolData.save();

        res.status(201).send('Data humSol stored successfully');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// GET /api/gethumSol
export const gethumSolData = async (req, res) => {
    try {
        const data = await SolModel.find().sort({ timestamp: -1 });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// GET /api/sol-count
export const getSolCount = async (req, res) => {
    try {
        const count = await SolModel.countDocuments();
        
        res.status(200).json({
            success: true,
            count,
            message: `Total des données d'humidité du sol: ${count}`
        });
    } catch (error) {
        console.error("Error counting soil humidity data:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors du comptage des données d'humidité du sol"
        });
    }
}

// GET /api/all-sol
export const getAllSol = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'timestamp', order = 'desc' } = req.query;
        
        const sortOptions = {};
        sortOptions[sort] = order === 'asc' ? 1 : -1;

        const data = await SolModel.find()
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await SolModel.countDocuments();

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
        console.error("Error getting all soil data:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des données du sol"
        });
    }
}

// DELETE /api/delete-sol/:id
export const deleteSolById = async (req, res) => {
    try {
        const { id } = req.params;

        const solData = await SolModel.findById(id);
        if (!solData) {
            return res.status(404).json({
                success: false,
                message: "Donnée d'humidité du sol non trouvée"
            });
        }

        await SolModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Donnée d'humidité du sol supprimée avec succès",
            deletedData: {
                id: solData._id,
                timestamp: solData.timestamp,
                soilHumidity: solData.soilHumidity
            }
        });
    } catch (error) {
        console.error("Error deleting soil data:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de la donnée d'humidité du sol"
        });
    }
}

// PUT /api/modify-sol/:id
export const modifySol = async (req, res) => {
    try {
        const { id } = req.params;
        const { timestamp, soilHumidity } = req.body;

        // Vérifier si la donnée existe
        const existingData = await SolModel.findById(id);
        if (!existingData) {
            return res.status(404).json({
                success: false,
                message: "Donnée d'humidité du sol non trouvée"
            });
        }

        // Préparer les champs à mettre à jour
        const updateFields = {};
        if (timestamp) updateFields.timestamp = timestamp;
        if (soilHumidity !== undefined) updateFields.soilHumidity = soilHumidity;

        // Mettre à jour la donnée
        const updatedData = await SolModel.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Donnée d'humidité du sol modifiée avec succès",
            data: updatedData
        });
    } catch (error) {
        console.error("Error modifying soil data:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la modification de la donnée d'humidité du sol"
        });
    }
}