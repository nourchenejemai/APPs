import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PhSchema = new Schema(
    {
        
        ph: {
            type: Number,
            required: true 
        },
        
        
         timestamp: {
            type: Date, default: Date.now 

        }
       

    }
)
export const PhModel = mongoose.model('ph', PhSchema);
    