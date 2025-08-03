import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUserData,getUsers, registerUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.get('/getusers',getUsers);
userRouter.post('/register',registerUser)



export default userRouter;