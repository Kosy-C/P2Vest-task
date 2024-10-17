"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskInstance = void 0;
const sequelize_1 = require("sequelize");
const DB_config_1 = require("../DB.config");
const userModel_1 = require("./userModel");
class TaskInstance extends sequelize_1.Model {
}
exports.TaskInstance = TaskInstance;
TaskInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    due_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            customValidator: (value) => {
                const enums = [
                    "To-Do",
                    "In-Progress",
                    "Completed"
                ];
                if (!enums.includes(value)) {
                    throw new Error("Chosen status is not a valid option");
                }
            },
        },
    },
    userAssignedTo: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: DB_config_1.db,
    tableName: 'task'
});
// Define associations
TaskInstance.belongsTo(userModel_1.UserInstance, {
    foreignKey: 'userAssignedTo',
    as: 'assignedUser'
});
userModel_1.UserInstance.hasMany(TaskInstance, {
    foreignKey: 'userAssignedTo',
    as: 'tasks' // Updated for clarity
});
