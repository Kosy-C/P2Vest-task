import { Sequelize } from "sequelize";

require("dotenv").config();

export const db = new Sequelize(
    process.env.DATABASE_NAME as string,
    process.env.DATABASE_USERNAME as string,
    process.env.DATABASE_PASSWORD as string,
    {
        host: process.env.DATABASE_HOST,
        dialect: "postgres",
        logging: false
    }
);

export const connectDB = async () => {
    try {
        await db.authenticate();
        await db.sync();
        console.log("Database connection established successfully");
    } catch (error) {
        console.log("Unable to connect to database:", error);
    }
};

export const FromAdminMail = process.env.FromAdminMail as string;
export const userSubject = process.env.usersubject as string;

export const APP_SECRET = process.env.APP_SECRET as string;
