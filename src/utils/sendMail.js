import nodemailer from "nodemailer";

import { SMTP } from "../constants/index.js";
import { env } from "../utils/env.js";

var transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: 2525,
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
