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
const generateFileName_1 = __importDefault(require("./generateFileName"));
const getLoxoneBackupUrl_1 = __importDefault(require("./getLoxoneBackupUrl"));
const config_1 = __importDefault(require("../config"));
const downloadFile_1 = require("./downloadFile");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const user_1 = require("../models/user");
function createBackup(server, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password, serial_number, name, _id: serverId } = server;
            console.log(server);
            const backupUrl = yield (0, getLoxoneBackupUrl_1.default)(serial_number);
            if (!backupUrl) {
                throw Error("Error generating backup url");
            }
            const fileName = (0, generateFileName_1.default)(name || "name_not_found");
            const outputPath = path_1.default.join(config_1.default, userId.toString(), serverId === null || serverId === void 0 ? void 0 : serverId.toString());
            fs_1.default.mkdirSync(outputPath, { recursive: true });
            yield (0, downloadFile_1.downloadFile)(backupUrl, {
                username,
                password,
            }, path_1.default.join(outputPath, `${fileName}.zip`));
            yield user_1.User.updateOne({ _id: userId, "servers._id": serverId }, {
                $push: {
                    "servers.$.backups": {
                        fileName: fileName,
                        date: new Date().toISOString(),
                    },
                },
            });
            // await uploadFile(
            //   outputPath,
            //   fileName,
            //   userId as ObjectId,
            //   serverId as ObjectId
            // );
        }
        catch (error) {
            console.error("Error creating backup:", error.message);
        }
    });
}
exports.default = createBackup;
