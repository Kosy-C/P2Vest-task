import { DataTypes, Model } from "sequelize";
import { db } from "../DB.config";
import { TaskInstance } from "./taskModel";

export interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    salt: string;
    otp?: number;
    otp_expiry: Date;
    verified: boolean;
}

export class UserInstance extends Model<UserAttributes> {}

UserInstance.init ({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {msg: "Email address is required"},
            isEmail: {msg: "Please provide a valid email"}
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Password is required" },
            notEmpty: { msg: "Provide a password" },
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          customValidator: (value: any) => {
            const enums = [
              "Admin",
              "Regular User",
            ];
            if (!enums.includes(value)) {
              throw new Error("Not a valid option");
            }
          },
        },
      },
    salt: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Salt is required" },
          notEmpty: { msg: "Provide a salt" },
        },
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: "User must be verified" },
          notEmpty: { msg: "User is not verified" },
        },
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: true, 
    },
    otp_expiry: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "OTP has expired" }
        }
    }
},
{
    sequelize: db,
    tableName: 'user'
});

// TaskInstance.belongsTo(UserInstance, {
//     foreignKey: 'userAssignedTo',
//     as: 'assignedUser'
// });

// UserInstance.hasMany(TaskInstance, {
//     foreignKey: 'userAssignedTo',
//     as: 'task'
// })
