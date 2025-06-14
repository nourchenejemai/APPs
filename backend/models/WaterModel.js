import mongoose from "mongoose";

const Schema = mongoose.Schema;

const WaterSchema = new Schema(
    {
        
        
         timestamp: {
            type: Date, default: Date.now 

        },
        salinity: {
            type: Number,
            required: true 
        }
       

    }
)
export const WaterModel = mongoose.model('water', WaterSchema);
    