"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backupLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 50,
    headers: true,
    handler: (_req, res) => {
        res.status(429).json({ message: "Exceeded request limit." });
    },
});
exports.backupLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 5,
    handler: (_req, res) => {
        res
            .status(429)
            .json({ message: "Exceeded request limit. Allowance: 5 requests/hour." });
    },
    headers: true,
});
exports.default = limiter;
