import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SensorSchema = new Schema(
    {
        
        temperature: {
            type: Number,
            required: true 
        },
        humidity: {
            type: Number,
            required: true 
        },
       
        timestamp: {
            type: Date, default: Date.now 

        },
       

    }
)
export const SensorModel = mongoose.model('sensor', SensorSchema);
    