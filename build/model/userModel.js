"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const sequelize_1 = require("sequelize");
const DB_config_1 = require("../DB.config");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: { msg: "Email address is required" },
            isEmail: { msg: "Please provide a valid email" }
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Password is required" },
            notEmpty: { msg: "Provide a password" },
        }
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        validate: {
            customValidator: (value) => {
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
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Salt is required" },
            notEmpty: { msg: "Provide a salt" },
        },
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: { msg: "User must be verified" },
            notEmpty: { msg: "User is not verified" },
        },
    },
    otp: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    otp_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: { msg: "OTP has expired" }
        }
    }
}, {
    sequelize: DB_config_1.db,
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
