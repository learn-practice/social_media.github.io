import express from 'express';
import {signupUser,loginUser,logoutUser,followUnfollowUser, updateUser, getUserProfile} from '../controllers/userController.js';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();
router.get('/profile/:query',getUserProfile)
router.post('/singup',signupUser)
//login
router.post('/login',loginUser)
//logout
router.post('/logout',logoutUser)
//follow
router.post('/follow/:id',protectRoute,followUnfollowUser)
router.put('/update/:id',protectRoute,updateUser)
//update profile
export default router;