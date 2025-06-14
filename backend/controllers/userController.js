import { userModel } from "../models/userModel.js";
import { isAccountVerified } from "./authController.js";

export const getUserData = async (request,response)=>{
    try{
        const {userId} = request.body;

        const user = await userModel.findById(userId);
        if(!user){
            return response.json({success: false,message:"User not found"});
        }

        response.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });


    }catch(error){
        response.json({success: false,message:error.message});

    }


}
