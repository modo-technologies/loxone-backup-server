import { google } from "googleapis";
import "dotenv/config";
const nodemailer = require("nodemailer");
const OAuth2 = google.auth.OAuth2;

const createTransport = async () => {
  google.options({
    http2: true,
  });
  const email: string = process.env.OAUTH_EMAIL as string;
  const clientSecret: string = process.env.OAUTH_CLIENT_SECRET as string;
  const clientID: string = process.env.OAUTH_CLIENTID as string;
  const refreshToken: string = process.env.OAUTH_REFRESH_TKN as string;

  const client = new OAuth2(
    clientID,
    clientSecret,
    "https://developers.google.com/oauthplayground"
  );
  client.setCredentials({
    refresh_token: refreshToken,
  });
  const accessToken = await new Promise((resolve, reject) => {
    client.getAccessToken((err, res) => {
      if (err) {
        console.log(err);
        reject(new Error("Error, failed to generate token."));
      }
      resolve(res);
    });
  });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      accessToken,
      type: "OAuth2",
      user: email,
      clientId: clientID,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
  return transporter;
};

const emailOtp = async (otp: number, email: string): Promise<void> => {
  try {
    const transporter = await createTransport();
    transporter.sendMail({
      subject: "OTP Verification - Social-Website",
      text: "OTP",
      to: email,
      from: process.env.OAUTH_EMAIL,
      html: `<div
      style="
        font-family: Franklin Gothic;
        max-width: 550px;
        background: #FBFCFA;
        margin: auto;
        padding: 10px;
        border-radius: 15px;
      "
    >
        Your otp is <strong>${otp}</strong>
    </div>`,
    });
  } catch (err) {
    console.log(err);
  }
};

export default emailOtp;
