"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_SECRET = exports.userSubject = exports.FromAdminMail = exports.connectDB = exports.db = void 0;
const sequelize_1 = require("sequelize");
require("dotenv").config();
exports.db = new sequelize_1.Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    logging: false
});
const connectDB = async () => {
    try {
        await exports.db.authenticate();
        await exports.db.sync();
        console.log("Database connection established successfully");
    }
    catch (error) {
        console.log("Unable to connect to database:", error);
    }
};
exports.connectDB = connectDB;
exports.FromAdminMail = process.env.FromAdminMail;
exports.userSubject = process.env.usersubject;
exports.APP_SECRET = process.env.APP_SECRET;
