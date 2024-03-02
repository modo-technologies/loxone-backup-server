"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getAccessToken = (payload) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, "zcxvbn", {
        expiresIn: "365d",
    });
    return accessToken;
};
exports.getAccessToken = getAccessToken;
exports.default = exports.getAccessToken;
