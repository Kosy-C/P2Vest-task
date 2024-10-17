import { DataTypes, Model } from "sequelize";
import { db } from "../DB.config";
import { UserInstance } from "./userModel";

export interface TaskAttributes {
    id: string;
    title: string;
    description: string;
    due_date: Date;
    status: string;
    userAssignedTo: string;
}

export class TaskInstance extends Model<TaskAttributes> {
    // public userAssignedTo!: string;
}

TaskInstance.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            customValidator: (value: any) => {
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
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: db,
    tableName: 'task'
});

// Define associations
TaskInstance.belongsTo(UserInstance, {
    foreignKey: 'userAssignedTo',
    as: 'assignedUser'
});

UserInstance.hasMany(TaskInstance, {
    foreignKey: 'userAssignedTo',
    as: 'tasks' // Updated for clarity
});

