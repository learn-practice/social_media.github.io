import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getMessage, sendMessage,getConversation } from '../controllers/messageController.js';
const router = express.Router();
router.get("/conversation",protectRoute,getConversation)
router.get("/:otherUserId",protectRoute,getMessage)
router.post("/",protectRoute,sendMessage)
export default router;