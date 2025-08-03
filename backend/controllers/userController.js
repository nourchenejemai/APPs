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
//GET
export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find(); // get all users from MongoDB
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // fallback to 'user' if not provided
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Registration failed', detail: error.message });
  }
};
