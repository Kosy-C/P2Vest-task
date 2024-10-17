"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controller/taskController");
const authorization_1 = require("../middleware/authorization");
const router = express_1.default.Router();
router.post('/create-task', authorization_1.createTaskAuth, taskController_1.createTask);
router.post('/update-task/:uuidtask', authorization_1.updateStatusAuth, taskController_1.updateTask);
router.post('/assign-task/:uuidTask', authorization_1.updateStatusAuth, taskController_1.assignTask);
exports.default = router;
