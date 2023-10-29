const nodemailer = require("nodemailer");

require("dotenv").config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "yurchyk_y@meta.ua",
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const emailOptions = { ...data, from: "yurchyk_y@meta.ua" };

  await transporter.sendMail(emailOptions);

  return true;
};

module.exports = { sendEmail };
