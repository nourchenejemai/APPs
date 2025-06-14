import { request, response } from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";
import { isValidObjectId } from "mongoose";
import transporter from "../config/nodemailer.js"
import MailMessage from "nodemailer/lib/mailer/mail-message.js";
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";

export const register = async (request, response)=>{
    
    const {name, email, password}= request.body;

    if (!name || !email ||!password){
        return response.json({success: false, message:'Missing Details'})

    }
    try {
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return response.json({success: false, message:'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});

        response.cookie('token', token ,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
         //send welcome email
         const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to GreatStack',
            text: `welcom to greatstack website. Your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        return response.json({success: true});


    }catch(error){
        response.json({success: false, message: error.message})
    }
   
}

export const login = async (request, response)=>{
    const {email, password}= request.body;
    if(!email || !password){
        return response.json({success: false,message: 'Email ans password are required'})

    }try {
        const user = await userModel.findOne({email});

        if(!user){
            return response.json({success: false,message: 'Invalid email'})

        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return response.json({success: false,message: 'Invalid password'})

        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});

        response.cookie('token', token ,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
       

        return response.json({success: true});


    }catch (error){
        return  response.json({success: false, message: error.message});
    }
}

export const logout = async (request,response) =>{
    try{
        response.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
           
        })

        return response.json({success: true,message: "Logged Out"})

    }catch (error){
        return  response.json({success: false, message: error.message});
    }

}

//send Verification OTP to the User's Email
export const sendVerifyOtp = async (request, response)=>{
    try{
        const {userId} = request.body;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return response.json({success: false, message: "Account Already verified"});
        }

        const otp = String (Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        const mailOptions = {
            from :process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            //text: `YOUR otp is ${otp}. Verify your account using this OTP `,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOptions);

        response.json({ success: true, message: 'Verification OTP sent on Email'});

    }catch (error){
          response.json({success: false, message: error.message});
    }

}

export const verifyEmail = async(request, response)=>{
    const {userId, otp} = request.body;

    if(!userId || !otp){
        return response.json({ success: false, message: 'Missing Details'})
    }
    try{

        const user = await userModel.findById(userId);

        if(!user){
            return response.json({ success: false, message: 'User not found'});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return response.json({ success: false, message: 'Invalid OTP'});
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return response.json({ success: false, message: 'OTP Expired'});

        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt= 0;

        await user.save();
        return response.json({ success: true, message: 'Email verified successfully'});



    }catch(error){
        response.json({success: false, message: error.message});
  }
}
//check if user is authenticated
export const isAccountVerified = async (request, response)=>{
    try{
        return response.json({ success: true});



    }catch(error){
        response.json({success: false, message: error.message});
    }
    

}

//send password Reset OTP
export const sendResetOtp = async (request, response)=>{
    const {email} = request.body;

    if(!email){
        return response.json({ success: false, message: 'Email is required'})
    }
    try{

        const user = await userModel.findOne({email});
        if(!user){
            return response.json({ success: false, message: 'User not found'});

        }
        const otp = String (Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save();

        const mailOptions = {
            from :process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            //text: `YOUR otp for resetting your password is ${otp} .Use this OTP proceed with resetting your password. `,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOptions);

        return response.json({success: true, message: 'OTP sent to your email'});

       


    }catch(error){
        response.json({success: false, message: error.message});
    }
    
}

//Reset User Password
export const resetPassword = async (request, response)=>{
    const {email, otp, newPassword} = request.body;

    if(!email || !otp ||!newPassword){
        return response.json({success: false, message: 'Email ,OTP, and new password are required'});

    }try{

        const user = await userModel.findOne({email});
        if(!user){
            return response.json({success: false, message: 'User not found'});

        }
        if(user.resetOtp === "" || user.resetOtp !== otp){
            return response.json({success: false, message: 'Invalid OTP'});

        }
        if(user.resetOtpExpireAt <Date.now()){
            return response.json({success: false, message: 'OTP Expired'});

        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt= 0;

        await user.save();

        return response.json({success: true, message: 'password been reset successfully'});



           

    }catch(error){
        return response.json({success: false, message: error.message});
    }
}