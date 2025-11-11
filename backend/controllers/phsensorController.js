import { PhModel } from "../models/PhModel.js";

// POST /api/ph-data
export const createPhData = async (req, res) => {
    try {
        const { timestamp, ph } = req.body;

        const newPhData = new PhModel({ timestamp, ph });
        await newPhData.save();

        res.status(201).send('Data pH stored successfully');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// GET /api/getph
export const getPhData = async (req, res) => {
    try {
        const data = await PhModel.find().sort({ timestamp: -1 });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// GET /api/ph-count
export const getPhCount = async (req, res) => {
    try {
        const count = await PhModel.countDocuments();
        
        res.status(200).json({
            success: true,
            count,
            message: `Total des données pH: ${count}`
        });
    } catch (error) {
        console.error("Error counting pH data:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors du comptage des données pH"
        });
    }
}

// GET /api/all-ph
export const getAllPh = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'timestamp', order = 'desc' } = req.query;
        
        const sortOptions = {};
        sortOptions[sort] = order === 'asc' ? 1 : -1;

        const data = await PhModel.find()
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await PhModel.countDocuments();

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
        console.error("Error getting all pH data:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des données pH"
        });
    }
}

// DELETE /api/delete-ph/:id
export const deletePhById = async (req, res) => {
    try {
        const { id } = req.params;

        const phData = await PhModel.findById(id);
        if (!phData) {
            return res.status(404).json({
                success: false,
                message: "Donnée pH non trouvée"
            });
        }

        await PhModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Donnée pH supprimée avec succès",
            deletedData: {
                id: phData._id,
                timestamp: phData.timestamp,
                ph: phData.ph
            }
        });
    } catch (error) {
        console.error("Error deleting pH data:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de la donnée pH"
        });
    }
}

// PUT /api/modify-ph/:id
export const modifyPh = async (req, res) => {
    try {
        const { id } = req.params;
        const { timestamp, ph } = req.body;

        // Vérifier si la donnée existe
        const existingData = await PhModel.findById(id);
        if (!existingData) {
            return res.status(404).json({
                success: false,
                message: "Donnée pH non trouvée"
            });
        }

        // Préparer les champs à mettre à jour
        const updateFields = {};
        if (timestamp) updateFields.timestamp = timestamp;
        if (ph !== undefined) updateFields.ph = ph;

        // Mettre à jour la donnée
        const updatedData = await PhModel.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Donnée pH modifiée avec succès",
            data: updatedData
        });
    } catch (error) {
        console.error("Error modifying pH data:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la modification de la donnée pH"
        });
    }
}