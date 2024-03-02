"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const usersSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    pass: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
    },
    servers: [
        {
            miniserver: String,
            name: String,
            serial_number: String,
            backupStatus: String,
            username: String,
            lastBackup: Date,
            password: String,
            backups: [
                {
                    fileName: String,
                    date: Date,
                    logs: [
                        {
                            text: String,
                            date: Date,
                        },
                    ],
                },
            ],
        },
    ],
});
exports.User = mongoose_1.default.model("User", usersSchema);
