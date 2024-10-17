import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import { GeneratePassword, GenerateSalt, GenerateSignature, option, UserLoginSchema, UserRegisterSchema, validatePassword } from "../utils/utility";
import { emailHtml, GenerateOTP, mailSent } from "../utils/notification";
import { UserAttributes, UserInstance } from "../model/userModel";
import { FromAdminMail, userSubject } from "../DB.config";


/**===================================== CREATE USER ===================================== **/
export const RegisterUser = async (req: Request, res: Response): Promise<void>  => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        const uuiduser = uuidv4();

        const validateResult = UserRegisterSchema.validate(req.body, option);
        if (validateResult.error) {
             res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        
        // Check if the user already exists
        const existingUser = await UserInstance.findOne({
            where: { email: email },
        }) as unknown as UserAttributes;

        if (existingUser) {
             res.status(400).json({
                error: "User with the given email already exists",
            });
        };

        //Generate salt
        const salt = await GenerateSalt();

        const userPassword = await GeneratePassword(password, salt);

        //Generate OTP
        const { otp, expiry } = GenerateOTP();

        //Create User
        if (!existingUser) {
            const newUser = await UserInstance.create({
                id: uuiduser,
                name,
                email,
                password: userPassword,
                salt,
                verified: false,
                role: "Regular User",
                otp,
                otp_expiry: expiry,
            }) as unknown as UserAttributes;

            //send Email to user
            const html = emailHtml(otp);
            await mailSent(
                FromAdminMail,
                email,
                userSubject,
                html
            );

            //Generate a signature for user
            let signature = await GenerateSignature({
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
    } catch (err) {
        res.status(500).json({
            error: "Internal server Error", err,
            route: "/user/signup",
        });
    }
};

/**===================================== VERIFY USER ===================================== **/
export const verifyUser = async (req: Request, res: Response): Promise<void>  => {
    try {
        const { id } = req.params;

        // Find the user by ID
        const user = await UserInstance.findOne({
            where: { id },
        }) as unknown as UserAttributes;

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
        await UserInstance.update({ verified: true }, { where: { id } });

         res.status(200).json({
            message: "User's email verification successful"
        });
    } catch (err) {
        res.status(500).json({
            error: "Internal server error",
            route: "/user/verify/:id",
        });
    }
};

/**===================================== LOGIN USER ===================================== **/
export const UserLogin = async (req: JwtPayload, res: Response): Promise<void>  => {
    try {
        const { email, password } = req.body;

        const validateResult = UserLoginSchema.validate(req.body, option);
        if (validateResult.error) {
             res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }

        //check if the User exist
        const User = await UserInstance.findOne({
            where: { email: email },
        }) as unknown as UserAttributes;

        if (User) {
            //Validate password
            const isValidPassword = await validatePassword(
                password,
                User.password,
                User.salt
            );

            if (isValidPassword) {
                //Generate signature for user
                let signature = await GenerateSignature({
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
            } else {
                res.status(400).json({
                    Error: "Wrong email or password",
                });
            }
        }
         res.status(404).json({
            Error: `User with ${email} not found`,
        });
    } catch (err) {
        res.status(500).json({
            Error: "Internal server error", err,
            route: "/user/login",
        });
    }
};

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