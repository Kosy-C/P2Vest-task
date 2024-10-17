"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const authorization_1 = require("../middleware/authorization");
const router = express_1.default.Router();
router.post('/signup', authorization_1.adminAuth, userController_1.RegisterUser);
router.get('/verify/:id', userController_1.verifyUser);
router.post('/login', userController_1.UserLogin);
exports.default = router;
