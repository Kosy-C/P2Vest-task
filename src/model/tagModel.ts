import { DataTypes, Model } from 'sequelize';
import { TaskInstance } from './taskModel';
import { db } from '../DB.config';

export interface TagAttributes {
    id: string;
    type: string;
}

export class TagInstance extends Model<TagAttributes> {
    // public id!: number;
    // public name!: string;

    // timestamps!
    //   public readonly createdAt!: Date;
    //   public readonly updatedAt!: Date;
}

TagInstance.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure tags are unique
        validate: {
            customValidator: (value: any) => {
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
    sequelize: db,
    tableName: 'tag',
}
);

// Define many-to-many relationship between Tag and Task
TaskInstance.belongsToMany(TagInstance, {
    through: 'TaskTags',
    as: 'tags',
    foreignKey: 'taskId'
});

TagInstance.belongsToMany(TaskInstance, {
    through: 'TaskTags',
    as: 'tasks',
    foreignKey: 'tagId'
});
