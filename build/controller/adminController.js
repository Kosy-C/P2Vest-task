"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.deleteAnyComment = exports.updateStatus = exports.AdminLogin = exports.AdminSignup = void 0;
const uuid_1 = require("uuid");
const utility_1 = require("../utils/utility");
const notification_1 = require("../utils/notification");
const userModel_1 = require("../model/userModel");
const taskModel_1 = require("../model/taskModel");
const commentModel_1 = require("../model/commentModel");
const AdminSignup = async (req, res) => {
    try {
        const { name, email, password, } = req.body;
        const uuidAdmin = (0, uuid_1.v4)();
        const validateResult = utility_1.UserRegisterSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
            return;
            // return({
            //     message: "Invalid Request",
            // });
        }
        //Generate salt
        const salt = await (0, utility_1.GenerateSalt)();
        const adminPassword = await (0, utility_1.GeneratePassword)(password, salt);
        //Generate OTP
        const { otp, expiry } = (0, notification_1.GenerateOTP)();
        //check if the Admin exists
        const Admin = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        if (!Admin) {
            await userModel_1.UserInstance.create({
                id: uuidAdmin,
                name,
                email,
                password: adminPassword,
                salt,
                verified: true,
                role: "Admin",
                otp,
                otp_expiry: expiry,
            });
            //Re-check if the admin exist
            const Admin = (await userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            //Generate a signature for admin
            let signature = await (0, utility_1.GenerateSignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified,
            });
            res.status(201).json({
                message: "Admin created successfully",
                signature
            });
            // return({
            //     message: "Admin created successfully",
            //     signature
            // })
        }
        ;
        res.status(400).json({
            message: "Admin already exist!",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error", err,
            route: "/admins/signup",
        });
    }
};
exports.AdminSignup = AdminSignup;
/**=====================================  LOGIN ADMIN ===================================== **/
const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utility_1.UserLoginSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
            return;
        }
        ;
        //check if the Admin exists
        const Admin = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        const validation = await (0, utility_1.validatePassword)(password, Admin.password, Admin.salt);
        if (validation) {
            //Generate signature
            let signature = await (0, utility_1.GenerateSignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified,
            });
            res.status(200).json({
                message: "You have successfully logged in",
                signature,
                role: Admin.role,
            });
        }
        res.status(400).json({
            Error: "Wrong Username or password",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error", err,
            route: "/admins/login",
        });
    }
};
exports.AdminLogin = AdminLogin;
/**===================================== ADMIN UPDATE ANY TASK STATUS ===================================== **/
const updateStatus = async (req, res, next) => {
    try {
        const uuidTask = req.params.uuidTask;
        const { status } = req.body;
        const validateResult = utility_1.taskSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
            return;
        }
        // Validation for status
        if (!['To-Do', 'In Progress', 'Completed'].includes(status)) {
            res.status(400).json({ message: 'Invalid task status' });
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
        await taskModel_1.TaskInstance.update({ status }, {
            where: { id: uuidTask },
        });
        res.status(200).json({
            message: `Task status updated to ${status}.`,
            task,
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error", err,
            route: "/update-status/:uuidtask",
        });
    }
};
exports.updateStatus = updateStatus;
/**===================================== ADMIN DELETE ANY COMMENT ===================================== **/
const deleteAnyComment = async (req, res, next) => {
    try {
        const { uuidComment } = req.params;
        const comment = await commentModel_1.CommentInstance.findOne({
            where: { id: uuidComment },
        });
        if (!comment) {
            res.status(404).json({
                Error: "Comment not found",
            });
            return;
        }
        ;
        await commentModel_1.CommentInstance.destroy({
            where: { id: uuidComment },
        });
        res.status(200).json({
            message: "Comment deleted successfully",
            uuidComment
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/delete-comment/:uuidComment"
        });
    }
    ;
};
exports.deleteAnyComment = deleteAnyComment;
/**===================================== DELETE USER ===================================== **/
const deleteUser = async (req, res, next) => {
    try {
        const { uuiduser } = req.params;
        const user = await userModel_1.UserInstance.findOne({
            where: { id: uuiduser },
        });
        if (!user) {
            res.status(404).json({
                Error: `User with ID "${uuiduser}" not found`,
            });
            return;
        }
        ;
        await userModel_1.UserInstance.destroy({
            where: { id: uuiduser },
        });
        res.status(200).json({
            message: "User deleted successfully",
            uuiduser
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/delete-user/:uuiduser"
        });
    }
    ;
};
exports.deleteUser = deleteUser;
