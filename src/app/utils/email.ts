
import nodemailer from "nodemailer";
import { envVars } from "../../config/env";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import path from "path";
import ejs from "ejs";
import { SendEmailOptions } from "../interfaces/email.interface";




const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    secure: true,

    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    },
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT)


})




export const sendEmail = async ({ to, subject, templateName, templateData, attachments }: SendEmailOptions) => {





    try {

        const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);

        const html = await ejs.renderFile(templatePath, templateData);


        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_USER,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            }))






        })


        console.log(`Email send to ${to} : ${info}`);



    } catch (error: any) {
        console.log("Emain sending Error ", error.message);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Emain sending Error");


    }

}