"use server";
import { google } from "googleapis";
import nodemailer from "nodemailer";
const OAuth2 = google.auth.OAuth2;
const createTransporter = async () => {
  const OAuth2_client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground",
  );
  OAuth2_client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
    access_token: process.env.ACCESS_TOKEN,
  });
  const accessToken = await new Promise((resolve, reject) => {
    OAuth2_client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });
  const transporter1 = nodemailer.createTransport({
    host: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "username",
      pass: "pass",
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken: accessToken as string,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });
  return transporter;
};
export const sendEmail = async (emailOptions: object) => {
  const emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};
