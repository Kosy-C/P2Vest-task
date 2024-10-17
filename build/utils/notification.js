"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHtml = exports.mailSent = exports.GenerateOTP = void 0;
const DB_config_1 = require("../DB.config");
const nodemailer_1 = __importDefault(require("nodemailer"));
require('dotenv').config();
const GenerateOTP = () => {
    const otp = Math.floor(Math.random() * 900000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    /*this shows we want it to expire in 30 mins, but first convert it from miliseconds to mins */
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
const transport = nodemailer_1.default.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});
const mailSent = async (from, to, subject, html) => {
    try {
        const response = await transport.sendMail({
            from: DB_config_1.FromAdminMail,
            to,
            subject: DB_config_1.userSubject,
            html,
        });
        return response;
    }
    catch (err) {
        console.log(err);
    }
};
exports.mailSent = mailSent;
const emailHtml = (otp) => {
    let response = `
    <div style = "max-width:700px; 
        margin:auto; 
        border:10px solid #ddd;
        padding:50px 20px; 
        font-size:110%;">
    <h2 style="text-align:center;
        text-transform:uppercase;
        color:teal;">
            New User OTP
    </h2>
    <p> Hi, your otp is ${otp}, and it'll expire in 30mins. </p>
    <h5> DO NOT DISCLOSE TO ANYONE <h5>
    </div>
    `;
    return response;
};
exports.emailHtml = emailHtml;
