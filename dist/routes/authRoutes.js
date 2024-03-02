"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const authController_1 = __importDefault(require("../controllers/authController"));
const router = express_1.default.Router();
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.post("/signup", authController_1.default.signUp);
// const otpHandler: RequestResponse = (req, res) => {
//   authController.verifyOtp(req, res);
// };
// router.post("/verify-otp", otpHandler);
router.post("/login", authController_1.default.loginHandler);
// const forgotPassOtp: RequestResponse = (req, res) => {
//   authController.forgotPassOtp(req, res);
// };
// router.post("/forgot-pass-otp", forgotPassOtp);
// const forgotPassReset: RequestResponse = (req, res) => {
//   authController.forgotPassReset(req, res);
// };
// router.post("/forgot-pass", forgotPassReset);
exports.default = router;
