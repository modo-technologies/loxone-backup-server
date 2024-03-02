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
const googleapis_1 = require("googleapis");
const fs_1 = require("fs");
require("dotenv/config");
const createDriveFolder_1 = __importDefault(require("./createDriveFolder"));
const OAuth2 = googleapis_1.google.auth.OAuth2;
const { OAUTH_CLIENT_SECRET, OAUTH_CLIENTID, OAUTH_REFRESH_TKN, REDIRECT_URI } = process.env;
const scopes = ["https://www.googleapis.com/auth/drive"];
const oauth2Client = new OAuth2(OAUTH_CLIENTID, OAUTH_CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({
    refresh_token: OAUTH_REFRESH_TKN,
});
const drive = googleapis_1.google.drive({ version: "v3", auth: oauth2Client });
function uploadFile(filePath, fileName, userId, serverId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userFolderId = yield (0, createDriveFolder_1.default)(userId.toString(), drive);
            const serverFolderId = yield (0, createDriveFolder_1.default)(serverId.toString(), drive, userFolderId);
            const media = {
                mimeType: "application/zip",
                body: (0, fs_1.createReadStream)(filePath),
            };
            yield drive.files.create({
                media,
                fields: "id",
                requestBody: {
                    name: fileName,
                    parents: [serverFolderId],
                },
            });
        }
        catch (error) {
            console.error("Error uploading file to Google Drive:", error.message);
            throw error;
        }
    });
}
exports.default = uploadFile;
