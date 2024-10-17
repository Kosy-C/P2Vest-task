import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import { GeneratePassword, GenerateSalt, GenerateSignature, option, taskSchema, UserLoginSchema, UserRegisterSchema, validatePassword } from "../utils/utility";
import { GenerateOTP } from "../utils/notification";
import { UserAttributes, UserInstance } from "../model/userModel";
import { TaskInstance } from "../model/taskModel";
import { CommentInstance } from "../model/commentModel";

/**===================================== SIGNUP/CREATE ADMIN ===================================== **/
export interface adminResponse {
    message: string;
    signature?: string;
}
export const AdminSignup = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        const uuidAdmin = uuidv4();

        const validateResult = UserRegisterSchema.validate(req.body, option);

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
        const salt = await GenerateSalt();
        const adminPassword = await GeneratePassword(password, salt);

        //Generate OTP
        const { otp, expiry } = GenerateOTP();

        //check if the Admin exists
        const Admin = await UserInstance.findOne({
            where: { email: email },
        });

        if (!Admin) {
            await UserInstance.create({
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
            const Admin = (await UserInstance.findOne({
                where: { email: email },
            })) as unknown as UserAttributes;

            //Generate a signature for admin
            let signature = await GenerateSignature({
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
        };

         res.status(400).json({
            message: "Admin already exist!",
        });
      
    } catch (err) {
         res.status(500).json({
            Error: "Internal server Error", err,
            route: "/admins/signup",
        });
    }
};

/**=====================================  LOGIN ADMIN ===================================== **/
export const AdminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const validateResult = UserLoginSchema.validate(req.body, option);
        if (validateResult.error) {
             res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
            return;
        };

        //check if the Admin exists
        const Admin = await UserInstance.findOne({
            where: { email: email },
        }) as unknown as UserAttributes;

        const validation = await validatePassword(
            password,
            Admin.password,
            Admin.salt
        );

        if (validation) {
            //Generate signature
            let signature = await GenerateSignature({
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

    } catch (err) {
        res.status(500).json({
            Error: "Internal server Error", err,
            route: "/admins/login",
        });
    }
};

/**===================================== ADMIN UPDATE ANY TASK STATUS ===================================== **/
export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const uuidTask = req.params.uuidTask;

        const { status } = req.body;

        const validateResult = taskSchema.validate(req.body, option);
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
        const task = await TaskInstance.findOne({
            where: { id: uuidTask },
        });

        if (!task) {
             res.status(404).json({
                Error: "Task not found!",
            });
        }

        await TaskInstance.update(
            { status }, {
            where: { id: uuidTask },
        }
        );

         res.status(200).json({
            message: `Task status updated to ${status}.`,
            task,
        });
    } catch (err) {
        res.status(500).json({
            Error: "Internal server error", err,
            route: "/update-status/:uuidtask",
        });
    }
};

/**===================================== ADMIN DELETE ANY COMMENT ===================================== **/
export const deleteAnyComment = async (req: JwtPayload, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { uuidComment } = req.params;

        const comment = await CommentInstance.findOne({
            where: { id: uuidComment },
        });

        if (!comment) {
             res.status(404).json({
                Error: "Comment not found",
            });
            return;
        };

        await CommentInstance.destroy({
            where: { id: uuidComment },
        });

         res.status(200).json({
            message: "Comment deleted successfully",
            uuidComment
        });
    } catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/delete-comment/:uuidComment"
        });
    };
};

/**===================================== DELETE USER ===================================== **/
export const deleteUser = async (req: JwtPayload, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { uuiduser } = req.params;
  
      const user = await UserInstance.findOne({
        where: { id: uuiduser },
      });
  
      if (!user) {
         res.status(404).json({
          Error: `User with ID "${uuiduser}" not found`,
        });
        return;
      };
  
      await UserInstance.destroy({
        where: { id: uuiduser },
      });
  
       res.status(200).json({
        message: "User deleted successfully",
        uuiduser
      });
    } catch (err) {
      res.status(500).json({
        Error: "Internal Server Error",
        route: "/delete-user/:uuiduser"
      });
    };
  };