import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SolSchema = new Schema(
    {
        soilHumidity : {
            type: Number,
            required: true
        },
        timestamp: {
            type: Date ,
            default: Date.now
        }
    }
)
export const SolModel = mongoose.model('sol', SolSchema);
