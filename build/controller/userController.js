"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogin = exports.verifyUser = exports.RegisterUser = void 0;
const uuid_1 = require("uuid");
const utility_1 = require("../utils/utility");
const notification_1 = require("../utils/notification");
const userModel_1 = require("../model/userModel");
const DB_config_1 = require("../DB.config");
/**===================================== CREATE USER ===================================== **/
const RegisterUser = async (req, res) => {
    try {
        const { name, email, password, } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utility_1.UserRegisterSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // Check if the user already exists
        const existingUser = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        if (existingUser) {
            res.status(400).json({
                error: "User with the given email already exists",
            });
        }
        ;
        //Generate salt
        const salt = await (0, utility_1.GenerateSalt)();
        const userPassword = await (0, utility_1.GeneratePassword)(password, salt);
        //Generate OTP
        const { otp, expiry } = (0, notification_1.GenerateOTP)();
        //Create User
        if (!existingUser) {
            const newUser = await userModel_1.UserInstance.create({
                id: uuiduser,
                name,
                email,
                password: userPassword,
                salt,
                verified: false,
                role: "Regular User",
                otp,
                otp_expiry: expiry,
            });
            //send Email to user
            const html = (0, notification_1.emailHtml)(otp);
            await (0, notification_1.mailSent)(DB_config_1.FromAdminMail, email, DB_config_1.userSubject, html);
            //Generate a signature for user
            let signature = await (0, utility_1.GenerateSignature)({
                id: newUser.id,
                email: newUser.email,
                verified: newUser.verified,
            });
            res.status(201).json({
                id: newUser.id,
                message: "User created successfully. Check your email for OTP verification",
                signature,
                verified: newUser.verified,
            });
        }
    }
    catch (err) {
        res.status(500).json({
            error: "Internal server Error", err,
            route: "/user/signup",
        });
    }
};
exports.RegisterUser = RegisterUser;
/**===================================== VERIFY USER ===================================== **/
const verifyUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the user by ID
        const user = await userModel_1.UserInstance.findOne({
            where: { id },
        });
        if (!user) {
            res.status(404).json({
                error: "User with this ID not found",
            });
        }
        // Check if the user is already verified
        if (user.verified === true) {
            res.status(400).json({
                error: "User is already verified",
            });
            return;
        }
        // Update the user as verified
        await userModel_1.UserInstance.update({ verified: true }, { where: { id } });
        res.status(200).json({
            message: "User's email verification successful"
        });
    }
    catch (err) {
        res.status(500).json({
            error: "Internal server error",
            route: "/user/verify/:id",
        });
    }
};
exports.verifyUser = verifyUser;
/**===================================== LOGIN USER ===================================== **/
const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utility_1.UserLoginSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the User exist
        const User = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        if (User) {
            //Validate password
            const isValidPassword = await (0, utility_1.validatePassword)(password, User.password, User.salt);
            if (isValidPassword) {
                //Generate signature for user
                let signature = await (0, utility_1.GenerateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
                // Example: Set a cookie with the token
                res.cookie("token", signature);
                res.status(200).json({
                    message: "Login Successful",
                    signature,
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
            }
            else {
                res.status(400).json({
                    Error: "Wrong email or password",
                });
            }
        }
        res.status(404).json({
            Error: `User with ${email} not found`,
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error", err,
            route: "/user/login",
        });
    }
};
exports.UserLogin = UserLogin;
// /**===================================== UPDATE TASK STATUS ===================================== **/
// export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
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
//         // Validation for status
//         if (!['To-Do', 'In Progress', 'Completed'].includes(status)) {
//             return res.status(400).json({ message: 'Invalid task status' });
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
//             { status }, {
//             where: { id: uuidTask },
//         }
//         );
//         return res.status(200).json({
//             message: `Task status updated to ${status}.`,
//             task,
//         });
//     } catch (err) {
//         res.status(500).json({
//             Error: "Internal server error", err,
//             route: "/update-status/:uuidtask",
//         });
//     }
// };
