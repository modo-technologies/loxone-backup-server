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
exports.downloadFile = void 0;
const fs_1 = require("fs");
const axios_1 = __importDefault(require("axios"));
const stream_1 = require("stream");
const util_1 = require("util");
const finishedAsync = (0, util_1.promisify)(stream_1.finished);
const unlinkAsync = (0, util_1.promisify)(fs_1.unlink);
function downloadFile(fileUrl, auth, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const writer = (0, fs_1.createWriteStream)(outputPath);
        writer.on("finish", () => __awaiter(this, void 0, void 0, function* () {
            console.log("File downloaded successfully");
        }));
        writer.on("error", (error) => __awaiter(this, void 0, void 0, function* () {
            console.error("Error writing to file:", error.message);
            try {
                yield unlinkAsync(outputPath);
                console.log("Incomplete file removed.");
            }
            catch (unlinkError) {
                console.error("Error removing incomplete file:", unlinkError);
            }
        }));
        try {
            const response = yield (0, axios_1.default)({
                method: "get",
                url: fileUrl,
                responseType: "stream",
                auth: {
                    username: auth.username,
                    password: auth.password,
                },
            });
            response.data.pipe(writer);
            yield Promise.race([
                finishedAsync(writer),
                new Promise((_, reject) => writer.on("error", reject)),
            ]);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.downloadFile = downloadFile;
