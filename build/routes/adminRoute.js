"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const authorization_1 = require("../middleware/authorization");
const router = express_1.default.Router();
router.post('/signup', adminController_1.AdminSignup);
router.post('/login', adminController_1.AdminLogin);
router.post('/update-status/:uuidtask', authorization_1.adminAuth, adminController_1.updateStatus);
router.delete('/delete-comment/:uuidComment', authorization_1.adminAuth, adminController_1.deleteAnyComment);
router.delete('/delete-user/:uuiduser', authorization_1.adminAuth, adminController_1.deleteUser);
exports.default = router;