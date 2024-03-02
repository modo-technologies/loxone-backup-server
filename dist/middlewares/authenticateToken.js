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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const user_1 = require("../models/user");
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res
                    .status(401)
                    .json({ message: "Invalid or missing access token" });
            }
            const accessToken = authHeader.slice("Bearer ".length);
            const user = jsonwebtoken_1.default.verify(accessToken, "zcxvbn");
            req.user = user;
            yield (0, db_1.default)();
            const userDetails = yield user_1.User.findOne({ _id: user._id });
            if (!userDetails) {
                return res.status(404).json({ message: "User not found" });
            }
            if (!(userDetails.accessToken === accessToken)) {
                return handleInvalidToken(res);
            }
            next();
        }
        catch (error) {
            console.log("Issue with JWT.");
            handleInvalidToken(res);
        }
    });
}
exports.default = authenticateToken;
function handleInvalidToken(res) {
    res.setHeader("Clear-Token", "true");
    res.setHeader("Access-Control-Expose-Headers", "Clear-Token");
    return res.status(401).json({ message: "Invalid Token" });
}
module.exports = authenticateToken;
