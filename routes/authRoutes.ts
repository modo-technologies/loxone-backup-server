import express from "express";
import bodyParser from "body-parser";
import authController from "../controllers/authController";
import { RequestResponse } from "../types";

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const signupHandler: RequestResponse = (req, res) => {
  // authController.signUp(req, res);
};
router.post("/signup", signupHandler);

// const otpHandler: RequestResponse = (req, res) => {
//   authController.verifyOtp(req, res);
// };
// router.post("/verify-otp", otpHandler);

const loginHandler: RequestResponse = (req, res) => {
  authController.loginHandler(req, res);
};
router.post("/login", loginHandler);

// const forgotPassOtp: RequestResponse = (req, res) => {
//   authController.forgotPassOtp(req, res);
// };
// router.post("/forgot-pass-otp", forgotPassOtp);

// const forgotPassReset: RequestResponse = (req, res) => {
//   authController.forgotPassReset(req, res);
// };
// router.post("/forgot-pass", forgotPassReset);

export default router;
