import express from 'express';
import { AdminSignup, AdminLogin, updateStatus, deleteAnyComment, deleteUser } from '../controller/adminController';
import { adminAuth } from '../middleware/authorization';

const router = express.Router();

router.post('/signup', AdminSignup); 
router.post('/login', AdminLogin);
router.post('/update-status/:uuidtask', adminAuth, updateStatus);
router.delete('/delete-comment/:uuidComment', adminAuth, deleteAnyComment);
router.delete('/delete-user/:uuiduser', adminAuth, deleteUser);

export default router;
