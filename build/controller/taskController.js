"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTask = exports.assignTask = exports.createTask = void 0;
const uuid_1 = require("uuid");
const utility_1 = require("../utils/utility");
const taskModel_1 = require("../model/taskModel");
/**===================================== CREATE TASK ===================================== **/
const createTask = async (req, res, next) => {
    try {
        const { title, description, due_date, userAssignedTo } = req.body;
        const uuidTask = (0, uuid_1.v4)();
        const validateResult = utility_1.taskSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        ;
        //check if the task exists
        // const task = await TaskInstance.findOne({
        //     where: { id: uuidTask },
        // });
        const existingTask = await taskModel_1.TaskInstance.findOne({
            where: { title },
        });
        if (!existingTask) {
            const assignedUserId = userAssignedTo || req.user.id; // Default to the current user if no user is assigned
            const newTask = await taskModel_1.TaskInstance.create({
                id: uuidTask,
                title,
                description,
                due_date,
                status: "To-Do",
                // userAssignedTo: req.user.id
                userAssignedTo: assignedUserId
            });
            res.status(201).json({
                message: "Task created and assigned successfully",
                task: newTask,
            });
        }
        ;
        res.status(400).json({
            Error: "Task already exist!",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error", err,
            route: "/create-task"
        });
    }
    ;
};
exports.createTask = createTask;
/**===================================== ASSIGN TASK ===================================== **/
const assignTask = async (req, res, next) => {
    try {
        const { uuidTask } = req.params;
        const { userAssignedTo } = req.body;
        // Validate the userAssignedTo field
        if (!userAssignedTo) {
            res.status(400).json({
                Error: "Assigned user ID is required",
            });
        }
        // Check if the task exists
        const task = await taskModel_1.TaskInstance.findOne({
            where: { id: uuidTask },
        });
        if (!task) {
            res.status(404).json({
                Error: "Task not found!",
            });
        }
        // Update the task with the assigned user
        await taskModel_1.TaskInstance.update({ userAssignedTo }, { where: { id: uuidTask } });
        res.status(200).json({
            message: "Task successfully assigned",
            task: {
                ...task,
                userAssignedTo,
            },
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            err,
            route: "/assign-task/:uuidTask",
        });
    }
};
exports.assignTask = assignTask;
/**===================================== UPDATE STATUS ===================================== **/
// export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const uuidTask = req.params.uuidTask;
//         const { status } = req.body;
//         const validateResult = taskSchema.validate(req.body, option);
//         if (validateResult.error) {
//             res.status(400).json({
//                 Error: validateResult.error.details[0].message,
//             });
//             return;
//         }
//         // Check if the task exists
//         const task = await TaskInstance.findOne({
//             where: { id: uuidTask },
//         });
//         if (!task) {
//             return res.status(404).json({
//                 Error: "Task not found!",
//             });
//         }
//         await TaskInstance.update(
//             { status },
//             {
//                 where: { id: uuidTask },
//             }
//         );
//         return res.status(200).json({
//             message: "Status updated successfully",
//             task,
//         });
//     } catch (err) {
//         res.status(500).json({
//             Error: "Internal server error", err,
//             route: "/update-status/:uuidtask",
//         });
//     }
// };
/**===================================== UPDATE TASK ===================================== **/
const updateTask = async (req, res, next) => {
    try {
        const uuidTask = req.params.uuidTask;
        const { title, description, due_date, status } = req.body;
        const validateResult = utility_1.taskSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
            return;
        }
        // Check if the task exists
        const task = await taskModel_1.TaskInstance.findOne({
            where: { id: uuidTask },
        });
        if (!task) {
            res.status(404).json({
                Error: "Task not found!",
            });
        }
        // Only allow admins to update any task, while users can update their own tasks
        // if (req.user.role !== 'Admin' && task.userAssignedTo !== req.user.id) {
        //      res.status(403).json({ message: 'Unauthorized' });
        //   }
        await taskModel_1.TaskInstance.update({
            title,
            description,
            due_date,
            status,
            userAssignedTo: req.user.id
        }, {
            where: { id: uuidTask },
        });
        res.status(200).json({
            message: "Task updated successfully",
            task,
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error", err,
            route: "/update-task/:uuidtask",
        });
    }
};
exports.updateTask = updateTask;
