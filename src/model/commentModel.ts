import { DataTypes, Model } from 'sequelize';
import { TaskInstance } from './taskModel';
import { UserInstance } from "./userModel";
import { db } from "../DB.config";

export interface CommentAttributes {
    id: string;
    comment: string;
    userId: string;
    taskId: string;
}

export class CommentInstance extends Model<CommentAttributes> {
//   public id!: number;
//   public comment!: string;
//   public userId!: number;
//   public taskId!: number;

}

CommentInstance.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    sequelize: db,
    tableName: 'comment',
  }
);

// Define relationships between Comment, User, and Task
CommentInstance.belongsTo(UserInstance, { 
    foreignKey: 'userId', as: 'user'
});
UserInstance.hasMany(CommentInstance, { 
    foreignKey: 'userId', as: 'comments' 
});
CommentInstance.belongsTo(TaskInstance, { 
    foreignKey: 'taskId', as: 'task'
});
TaskInstance.hasMany(CommentInstance, { 
    foreignKey: 'taskId', as: 'comments' 
});
