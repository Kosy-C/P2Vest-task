"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateRandomPassword = exports.verifySignature = exports.GenerateSignature = exports.validatePassword = exports.GeneratePassword = exports.GenerateSalt = exports.taskSchema = exports.UserLoginSchema = exports.UserRegisterSchema = exports.option = void 0;
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DB_config_1 = require("../DB.config");
exports.option = {
    abortEarly: false, /* means if there's an error in the first keys, it'll takecare of the error first before moving on to the next error  */
    errors: {
        wrap: { label: '' }
    }
};
exports.UserRegisterSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});
exports.UserLoginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    // password: Joi.string();
});
exports.taskSchema = joi_1.default.object().keys({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    due_date: joi_1.default.string().required(),
    userAssignedTo: joi_1.default.string().required(),
});
const GenerateSalt = async () => {
    return await bcryptjs_1.default.genSalt();
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = async (password, salt) => {
    return await bcryptjs_1.default.hash(password, salt);
};
exports.GeneratePassword = GeneratePassword;
const validatePassword = async (enteredPassword, savedPassword, salt) => {
    return await (0, exports.GeneratePassword)(enteredPassword, salt) === savedPassword;
};
exports.validatePassword = validatePassword;
const GenerateSignature = async (payload) => {
    return jsonwebtoken_1.default.sign(payload, DB_config_1.APP_SECRET, { expiresIn: '1d' });
};
exports.GenerateSignature = GenerateSignature;
const verifySignature = async (signature) => {
    return jsonwebtoken_1.default.verify(signature, DB_config_1.APP_SECRET);
};
exports.verifySignature = verifySignature;
const GenerateRandomPassword = () => {
    const Password = Math.floor(Math.random() * 10000).toString();
    return Password;
};
exports.GenerateRandomPassword = GenerateRandomPassword;
