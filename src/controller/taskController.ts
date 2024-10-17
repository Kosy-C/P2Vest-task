import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { option, taskSchema } from "../utils/utility";
import { TaskAttributes, TaskInstance } from "../model/taskModel";


/**===================================== CREATE TASK ===================================== **/
export const createTask = async (req: JwtPayload, res: Response, next: NextFunction): Promise<void>  => {
    try {
        const {
            title,
            description,
            due_date,
            userAssignedTo
        } = req.body;

        const uuidTask = uuidv4();

        const validateResult = taskSchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        };

        //check if the task exists
        // const task = await TaskInstance.findOne({
        //     where: { id: uuidTask },
        // });
        const existingTask = await TaskInstance.findOne({
            where: { title },
        });

        if (!existingTask) {
                const assignedUserId = userAssignedTo || req.user.id; // Default to the current user if no user is assigned

            const newTask = await TaskInstance.create({
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
        };

         res.status(400).json({
            Error: "Task already exist!",
        });

    } catch (err) {
        res.status(500).json({
            Error: "Internal Server Error", err,
            route: "/create-task"
        });
    };
};

/**===================================== ASSIGN TASK ===================================== **/
export const assignTask = async (req: JwtPayload, res: Response, next: NextFunction): Promise<void>  => {
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
        const task = await TaskInstance.findOne({
            where: { id: uuidTask },
        });

        if (!task) {
             res.status(404).json({
                Error: "Task not found!",
            });
        }

        // Update the task with the assigned user
        await TaskInstance.update(
            { userAssignedTo },
            { where: { id: uuidTask } }
        );

         res.status(200).json({
            message: "Task successfully assigned",
            task: {
                ...task,
                userAssignedTo,
            },
        });
    } catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            err,
            route: "/assign-task/:uuidTask",
        });
    }
};
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
export const updateTask = async (req: JwtPayload, res: Response, next: NextFunction): Promise<void>  => {
    try {
        const uuidTask = req.params.uuidTask;

        const {
            title,
            description,
            due_date,
            status
        } = req.body;

        const validateResult = taskSchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
            return;
        }

        // Check if the task exists
        const task = await TaskInstance.findOne({
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
        await TaskInstance.update({
            title,
            description,
            due_date,
            status,
            userAssignedTo: req.user.id
        }, {
                where: { id: uuidTask },
            }
        );

         res.status(200).json({
            message: "Task updated successfully",
            task,
        });
    } catch (err) {
        res.status(500).json({
            Error: "Internal server error", err,
            route: "/update-task/:uuidtask",
        });
    }
};