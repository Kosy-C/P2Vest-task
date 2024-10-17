import express from "express";
import { assignTask, createTask, updateTask } from "../controller/taskController";
import { createTaskAuth, updateStatusAuth } from "../middleware/authorization";

const router = express.Router();

router.post('/create-task', createTaskAuth, createTask);
router.post('/update-task/:uuidtask', updateStatusAuth, updateTask);
router.post('/assign-task/:uuidTask', updateStatusAuth, assignTask);

export default router;