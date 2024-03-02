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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const encryption_1 = require("../services/encryption");
const user_1 = require("../models/user");
const getAccessToken_1 = __importDefault(require("../helpers/getAccessToken"));
const authController = {
    signUp: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, pass } = req.body;
            yield (0, db_1.default)();
            const response = yield user_1.User.findOne({ email });
            if (!response) {
                const hashedPass = yield (0, encryption_1.encryptData)(pass);
                const user = new user_1.User({
                    email: email,
                    pass: hashedPass,
                });
                yield user.save();
                return res.status(200).json({ message: "User created." });
            }
            return res.status(200).json({ message: "User already exists." });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }),
    loginHandler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, pass } = req.body;
            yield (0, db_1.default)();
            const response = yield user_1.User.findOne({ email });
            if (!response) {
                return res.status(404).json({ message: "User doesn't exist! " });
            }
            const hashedPass = response.pass;
            const { _id } = response;
            const verifyPass = yield (0, encryption_1.decryptData)(pass, hashedPass);
            if (!verifyPass) {
                return res.status(401).json({ message: "Invalid Password" });
            }
            const accessToken = (0, getAccessToken_1.default)({
                _id: _id.toString(),
                email,
            });
            yield user_1.User.updateOne({ email }, { $set: { accessToken } });
            res.status(200).json(accessToken);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error!" });
        }
    }),
    changePass: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { _id } = req.user;
            const { newPassword, currentPassword } = req.body;
            if (!newPassword || !currentPassword) {
                return res.status(422).json({ message: "Missing Parameters" });
            }
            const user = yield user_1.User.findOne({ _id });
            if (!user) {
                return res.status(404).json({ message: "User doesn't exist! " });
            }
            const verifyPass = yield (0, encryption_1.decryptData)(currentPassword, user.pass);
            if (!verifyPass) {
                return res
                    .status(401)
                    .json({ message: "Invalid Password. Enter your SafeSync password." });
            }
            const hashPass = yield (0, encryption_1.encryptData)(newPassword);
            yield user_1.User.findOneAndUpdate({ _id }, { $set: { pass: hashPass } });
            res.status(200).json({ message: "Successful" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server Error" });
        }
    }),
};
exports.default = authController;
