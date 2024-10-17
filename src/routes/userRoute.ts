import express from "express";
import { RegisterUser, UserLogin, verifyUser } from "../controller/userController";
import { adminAuth } from "../middleware/authorization";

const router = express.Router();

router.post('/signup', adminAuth, RegisterUser);
router.get('/verify/:id', verifyUser);
router.post('/login', UserLogin);

export default router;