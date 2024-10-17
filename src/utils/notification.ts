import { FromAdminMail, userSubject } from "../DB.config"
import nodemailer from "nodemailer";

require('dotenv').config();

export const GenerateOTP = () => {
    const otp = Math.floor(Math.random() * 900000);

    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))
    /*this shows we want it to expire in 30 mins, but first convert it from miliseconds to mins */
    return { otp, expiry };
};

const transport = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {

        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,

    },
});
export const mailSent = async (
    from: string,
    to: string,
    subject: string,
    html: string
) => {
    try {
        const response = await transport.sendMail({
            from: FromAdminMail,
            to,
            subject: userSubject,
            html,
        });
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const emailHtml = (otp: number): string => {
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
    `
    return response;
};