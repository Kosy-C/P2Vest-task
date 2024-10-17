"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusAuth = exports.createTaskAuth = exports.adminAuth = void 0;
const DB_config_1 = require("../DB.config");
const userModel_1 = require("../model/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**===================================== ADMIN AUTH ===================================== **/
const adminAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).json({
                Error: "Kindly login"
            });
            return;
        }
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, DB_config_1.APP_SECRET);
        if (!verified) {
            res.status(401).json({
                Error: "unauthorised"
            });
            return;
        }
        ;
        const { id } = verified;
        // find the user by id
        const user = await userModel_1.UserInstance.findOne({
            where: { id: id },
        });
        if (!user) {
            res.status(404).json({
                Error: "User not found"
            });
            return;
        }
        if (user.role === "Admin") {
            req.user = verified;
        }
        else {
            res.status(403).json({
                Error: "Only Admin is allowed to perform this operation"
            });
        }
        next();
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error", err
        });
    }
};
exports.adminAuth = adminAuth;
/**===================================== CREATE TASK AUTH ===================================== **/
const createTaskAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).json({
                Error: "Kindly login",
            });
            return;
        }
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, DB_config_1.APP_SECRET);
        if (!verified) {
            res.status(401).json({
                Error: "Unauthorized",
            });
        }
        const { id, role } = verified;
        // find the user by id
        const user = await userModel_1.UserInstance.findOne({
            where: { id: id },
        });
        if (!user) {
            res.status(404).json({
                Error: "User not found",
            });
        }
        if (user.role === "Regular User") {
            req.user = verified;
            next();
        }
        else {
            res.status(401).json({
                Error: "Only regular users is allowed to create a task",
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error",
            err,
        });
    }
};
exports.createTaskAuth = createTaskAuth;
/**===================================== UPDATE TASK STATUS AUTH ===================================== **/
const updateStatusAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).json({
                Error: "Kindly login",
            });
        }
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, DB_config_1.APP_SECRET);
        if (!verified) {
            res.status(401).json({
                Error: "Unauthorized",
            });
        }
        const { id, role } = verified;
        // find the user by id
        const user = await userModel_1.UserInstance.findOne({
            where: { id: id },
        });
        if (!user) {
            res.status(404).json({
                Error: "User not found",
            });
        }
        if (user.role === "Regular User") {
            req.user = verified;
            next();
        }
        else {
            res.status(401).json({
                Error: "Only regular users is allowed to update the status of this task",
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error",
            err,
        });
    }
};
exports.updateStatusAuth = updateStatusAuth;
