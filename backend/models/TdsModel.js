import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tdsSchema = new Schema(
{
      
     tds: {
        type: Number,
        required: true 

     },
    ec:{
        type: Number,
        required: true

    } ,
    
    temperature:{
     type: Number,
     required: true

    }, 
    
    humidity:{
        type: Number,
        required: true,
    },
     
    timestamp: { 
        type: Date, 
        default: Date.now 
    }

})
export const tdsModel = mongoose.model('tds', tdsSchema);



      