import { Request, Response, NextFunction } from "express";
import { APP_SECRET } from "../DB.config";
import { UserAttributes, UserInstance } from "../model/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TaskInstance } from "../model/taskModel";

/**===================================== ADMIN AUTH ===================================== **/
export const adminAuth = async (req: JwtPayload, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authorization = req.headers.authorization

    if (!authorization) {
       res.status(401).json({
        Error: "Kindly login"
      });
      return;
    }

    const token = authorization.slice(7, authorization.length);
    let verified = jwt.verify(token, APP_SECRET)

    if (!verified) {
       res.status(401).json({
        Error: "unauthorised"
      });
      return;
    };

    const { id } = verified as { [key: string]: string }

    // find the user by id
    const user = await UserInstance.findOne({
      where: { id: id },
    }) as unknown as UserAttributes;

    if (!user) {
       res.status(404).json({
        Error: "User not found"
      });
      return;
    }

    if (user.role === "Admin" ) {
      req.user = verified;

    } else {
       res.status(403).json({
        Error: "Only Admin is allowed to perform this operation"
      })
    }
    next();
  } catch (err) {
     res.status(500).json({
      Error: "Internal server error", err
    });
  }
};

/**===================================== CREATE TASK AUTH ===================================== **/
export const createTaskAuth = async (req: JwtPayload, res: Response, next: NextFunction): Promise<void>  => {
    try {
      const authorization = req.headers.authorization;
  
      if (!authorization) {
         res.status(401).json({
          Error: "Kindly login",
        });
        return;
      }
  
      const token = authorization.slice(7, authorization.length);
      let verified = jwt.verify(token, APP_SECRET);
  
      if (!verified) {
         res.status(401).json({
          Error: "Unauthorized",
        });

      }
  
      const { id, role } = verified as { [key: string]: string };
  
      // find the user by id
      const user = await UserInstance.findOne({
        where: { id: id },
      }) as unknown as UserAttributes;
  
      if (!user) {
         res.status(404).json({
          Error: "User not found",
        });
      }
  
      if (user.role === "Regular User") {
        req.user = verified;
        next();
      } else {
         res.status(401).json({
          Error: "Only regular users is allowed to create a task",
        });
      }
    } catch (err) {
       res.status(500).json({
        Error: "Internal server error",
        err,
      });
    }
  };

/**===================================== UPDATE TASK STATUS AUTH ===================================== **/
export const updateStatusAuth = async (req: JwtPayload, res: Response, next: NextFunction): Promise<void>  => {
    try {
      const authorization = req.headers.authorization;
  
      if (!authorization) {
         res.status(401).json({
          Error: "Kindly login",
        });
      }
  
      const token = authorization.slice(7, authorization.length);
      let verified = jwt.verify(token, APP_SECRET);
  
      if (!verified) {
         res.status(401).json({
          Error: "Unauthorized",
        });
      }
  
      const { id, role } = verified as { [key: string]: string };
  
      // find the user by id
      const user = await UserInstance.findOne({
        where: { id: id },
      }) as unknown as UserAttributes;
  
      if (!user) {
         res.status(404).json({
          Error: "User not found",
        });
      }
  
      if (user.role === "Regular User") {
        req.user = verified;
        next();
      } else {
         res.status(401).json({
          Error: "Only regular users is allowed to update the status of this task",
        });
      }
    } catch (err) {
       res.status(500).json({
        Error: "Internal server error",
        err,
      });
    }
  };