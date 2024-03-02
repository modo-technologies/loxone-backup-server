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
exports.decryptData = exports.encryptData = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const encryptData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return yield bcrypt_1.default.hash(data, saltRounds).then((hash) => hash);
});
exports.encryptData = encryptData;
const decryptData = (data, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        bcrypt_1.default.compare(data, hash, (err, result) => {
            if (err) {
                throw err;
            }
            if (result) {
                return resolve(true);
            }
            else
                return resolve(false);
        });
    });
});
exports.decryptData = decryptData;
