"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
require("dotenv/config");
const nodemailer = require("nodemailer");
const OAuth2 = googleapis_1.google.auth.OAuth2;
const createTransport = () => __awaiter(void 0, void 0, void 0, function* () {
    googleapis_1.google.options({
        http2: true,
    });
    const email = process.env.OAUTH_EMAIL;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;
    const clientID = process.env.OAUTH_CLIENTID;
    const refreshToken = process.env.OAUTH_REFRESH_TKN;
    const client = new OAuth2(clientID, clientSecret, "https://developers.google.com/oauthplayground");
    client.setCredentials({
        refresh_token: refreshToken,
    });
    const accessToken = yield new Promise((resolve, reject) => {
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
});
const emailOtp = (otp, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = yield createTransport();
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
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = emailOtp;
