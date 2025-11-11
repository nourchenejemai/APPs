import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUserData,getUsers, registerUser ,deleteUser, updateUser,
  updateUserDataAccess,getUsersCount} from '../controllers/userController.js';



const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.get('/getusers',getUsers);
userRouter.get('/users/count',getUsersCount)
userRouter.post('/register',registerUser)
userRouter.delete('/delete/:id',deleteUser)
userRouter.put('/update/:id',userAuth, updateUser);
userRouter.put('/update-access/:id',userAuth, updateUserDataAccess);


export default userRouter;