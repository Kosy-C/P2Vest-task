import Joi from "joi";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { APP_SECRET } from "../DB.config";
import { AuthPayLoad } from "../interface";

export const option = {
    abortEarly: false,  /* means if there's an error in the first keys, it'll takecare of the error first before moving on to the next error  */
    errors: {
        wrap: {label: ''}
    }
};

export const UserRegisterSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

export const UserLoginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    // password: Joi.string();
});

export const taskSchema = Joi.object().keys({ 
    title: Joi.string().required(),
    description: Joi.string().required(),
    due_date: Joi.string().required(),
    userAssignedTo: Joi.string().required(),
});

export const GenerateSalt = async () => {
    return await bcrypt.genSalt()
};

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
};

export const validatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
    return await GeneratePassword(enteredPassword, salt) === savedPassword;
};

export const GenerateSignature = async (payload: AuthPayLoad) => {
    return jwt.sign(payload, APP_SECRET, { expiresIn: '1d' })
};

export const verifySignature = async (signature: string) => {
    return jwt.verify(signature, APP_SECRET) as JwtPayload
};

export const GenerateRandomPassword = ()=>{
    const Password = Math.floor(Math.random() * 10000).toString() ;
    return Password;
};
