import {PhModel} from "../models/PhModel.js"
//POST /api/ph-data
export const createPhData = async (req,res) =>{
    try {
        const {timestamp,ph} = req.body;

        const newPhData = new PhModel({ timestamp,ph});
        await newPhData.save();

    res.status(201).send('Data pH stored successfully');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

    
}

//GET /api/getph
export const getPhData = async (req,res) =>{

  try {
    const data = await PhModel.find().sort({ timestamp: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}