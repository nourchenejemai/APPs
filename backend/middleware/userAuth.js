import { request, response } from "express";
import jwt from "jsonwebtoken";


export const userAuth = async (request, response , next)=>{
    const {token} = request.cookies;

    if(!token){
        return response.json({ success: false, message: 'Not Authorized.Login Again'});

    }try{
        //Decode token
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id){
            request.body.userId = tokenDecode.id
        }else{
            return response.json({ success: false, message: 'Not Authorized.Login Again'});

        }
        next();


    }catch (error){
          response.json({success: false, message: error.message});
    }
}

export default userAuth;