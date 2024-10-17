"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagInstance = void 0;
const sequelize_1 = require("sequelize");
const taskModel_1 = require("./taskModel");
const DB_config_1 = require("../DB.config");
class TagInstance extends sequelize_1.Model {
}
exports.TagInstance = TagInstance;
TagInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure tags are unique
        validate: {
            customValidator: (value) => {
                const enums = [
                    "Urgent",
                    "Bug",
                    "Feature"
                ];
                if (!enums.includes(value)) {
                    throw new Error("Tag is not a valid option");
                }
            },
        },
    },
}, {
    sequelize: DB_config_1.db,
    tableName: 'tag',
});
// Define many-to-many relationship between Tag and Task
taskModel_1.TaskInstance.belongsToMany(TagInstance, {
    through: 'TaskTags',
    as: 'tags',
    foreignKey: 'taskId'
});
TagInstance.belongsToMany(taskModel_1.TaskInstance, {
    through: 'TaskTags',
    as: 'tasks',
    foreignKey: 'tagId'
});
