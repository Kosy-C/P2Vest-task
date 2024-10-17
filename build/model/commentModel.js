"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentInstance = void 0;
const sequelize_1 = require("sequelize");
const taskModel_1 = require("./taskModel");
const userModel_1 = require("./userModel");
const DB_config_1 = require("../DB.config");
class CommentInstance extends sequelize_1.Model {
}
exports.CommentInstance = CommentInstance;
CommentInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    comment: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    taskId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: DB_config_1.db,
    tableName: 'comment',
});
// Define relationships between Comment, User, and Task
CommentInstance.belongsTo(userModel_1.UserInstance, {
    foreignKey: 'userId', as: 'user'
});
userModel_1.UserInstance.hasMany(CommentInstance, {
    foreignKey: 'userId', as: 'comments'
});
CommentInstance.belongsTo(taskModel_1.TaskInstance, {
    foreignKey: 'taskId', as: 'task'
});
taskModel_1.TaskInstance.hasMany(CommentInstance, {
    foreignKey: 'taskId', as: 'comments'
});
