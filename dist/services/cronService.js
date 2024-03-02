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
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = __importDefault(require("../db"));
const user_1 = require("../models/user");
const createBackup_1 = __importDefault(require("../helpers/createBackup"));
const backupTask = node_cron_1.default.schedule("*/10 * * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    return;
    try {
        yield (0, db_1.default)();
        const database = yield user_1.User.find({});
        for (const data of database) {
            const { _id: userId } = data;
            for (const server of data.servers) {
                yield (0, createBackup_1.default)(server, userId);
            }
        }
    }
    catch (error) {
        console.error("Error creating backup:", error.message);
    }
}));
exports.default = backupTask;
