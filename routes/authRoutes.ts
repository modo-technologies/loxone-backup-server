import express from "express";
import bodyParser from "body-parser";
import authController from "../controllers/authController";

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/signup", authController.signUp);
router.post("/change-pass", authController.changePass);
router.post("/login", authController.loginHandler);

// const otpHandler: RequestResponse = (req, res) => {
//   authController.verifyOtp(req, res);
// };
// router.post("/verify-otp", otpHandler);

// const forgotPassOtp: RequestResponse = (req, res) => {
//   authController.forgotPassOtp(req, res);
// };
// router.post("/forgot-pass-otp", forgotPassOtp);

// const forgotPassReset: RequestResponse = (req, res) => {
//   authController.forgotPassReset(req, res);
// };
// router.post("/forgot-pass", forgotPassReset);

export default router;
