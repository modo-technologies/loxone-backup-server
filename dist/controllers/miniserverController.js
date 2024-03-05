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
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("../db"));
const user_1 = require("../models/user");
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
const validateServer_1 = __importDefault(require("../helpers/validateServer"));
const encryption_1 = require("../services/encryption");
const createBackup_1 = __importDefault(require("../helpers/createBackup"));
const miniServerController = {
    addNewServer: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, serial_number, username, backupStatus, miniserver, lastBackup, password, } = req.body;
            const { _id } = req.user;
            if (!(0, validateServer_1.default)(req.body)) {
                return res.status(400).json({ message: "Missing Fields" });
            }
            yield (0, db_1.default)();
            const existingServer = yield user_1.User.findOne({
                _id,
                "servers.serial_number": serial_number,
            });
            if (existingServer) {
                return res.status(400).json({
                    message: "Server with the same serial number already exists.",
                });
            }
            const updatedDocument = yield user_1.User.findOneAndUpdate({ _id }, {
                $addToSet: {
                    servers: {
                        name,
                        serial_number,
                        username,
                        backupStatus,
                        miniserver,
                        lastBackup,
                        password,
                    },
                },
            }, { new: true });
            if (updatedDocument) {
                const serverId = updatedDocument.servers[updatedDocument.servers.length - 1]._id;
                yield (0, createBackup_1.default)(Object.assign(Object.assign({}, req.body), { _id: serverId }), _id);
            }
            res.status(200).json({ message: "Server added successfully." });
        }
        catch (error) {
            console.log(error);
        }
    }),
    editMiniServer: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, serial_number, username, backupStatus, miniserver, lastBackup, password, } = req.body;
            const { _id } = req.user;
            if (!(0, validateServer_1.default)(req.body)) {
                return res.status(400).json({ message: "Missing Fields" });
            }
            yield (0, db_1.default)();
            yield user_1.User.updateOne({ _id, "servers.serial_number": serial_number }, {
                $set: {
                    "servers.$.name": name,
                    "servers.$.username": username,
                    "servers.$.backupStatus": backupStatus,
                    "servers.$.miniserver": miniserver,
                    "servers.$.lastBackup": lastBackup,
                    "servers.$.password": password,
                },
            });
            res
                .status(200)
                .json({ message: "Successfully edited the server details." });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }),
    getMiniservers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { _id } = req.user;
            yield (0, db_1.default)();
            const user = yield user_1.User.findById(_id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const miniservers = user.servers;
            res.status(200).json({ miniservers });
        }
        catch (error) {
            console.error("Error fetching miniservers:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }),
    deleteServer: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { _id } = req.user;
            const { pass, _id: serverId } = req.body;
            yield (0, db_1.default)();
            const user = yield user_1.User.findOne({ _id });
            if (!user)
                return res.status(404).json({ message: "User not found" });
            const verifyPass = yield (0, encryption_1.decryptData)(pass, user.pass);
            if (!verifyPass) {
                return res.status(401).json({ message: "Invalid password." });
            }
            const dir = path_1.default.join(config_1.default, _id, serverId);
            if (fs_1.default.existsSync(dir)) {
                fs_1.default.rmSync(dir, { recursive: true });
            }
            yield user_1.User.updateOne({ _id, "servers._id": serverId }, { $pull: { servers: { _id: serverId } } });
            res.status(200).json({ message: "Successfully deleted the server" });
        }
        catch (error) {
            console.log(error);
        }
    }),
    getBackups: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)();
            const { _id } = req.user;
            const { _id: serverId } = req.query;
            const user = yield user_1.User.findOne({ _id }, { servers: { $elemMatch: { _id: serverId } } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (user.servers[0].backups.length === 0) {
                return res.status(404).json({ message: "Backups not found" });
            }
            return res.status(200).json({ backups: user === null || user === void 0 ? void 0 : user.servers[0].backups });
        }
        catch (error) {
            return res.status(500).json({ message: "Server Error" });
        }
    }),
    downloadBackup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { _id } = req.user;
            const { _id: serverId, fileName } = req.query;
            const filePath = path_1.default.join(config_1.default, _id, serverId, `${fileName}.zip`);
            if (!fs_1.default.existsSync(filePath)) {
                return res.status(404).json({ message: "File not found" });
            }
            res.setHeader("Content-Disposition", `attachment; filename=${fileName}.zip`);
            res.setHeader("Content-Type", "application/zip");
            res.download(filePath, (err) => {
                if (err) {
                    console.error("Error downloading file:", err);
                    res.status(500).json({ message: "Internal Server Error" });
                }
            });
        }
        catch (error) {
            return res.status(500).json({ message: "Server Error" });
        }
    }),
    deleteBackup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { _id } = req.user;
            const { _id: serverId, fileName, backupId } = req.query;
            const filePath = path_1.default.join(config_1.default, _id, serverId, `${fileName}.zip`);
            if (!fs_1.default.existsSync(filePath)) {
                return res.status(404).json({ message: "File not found" });
            }
            fs_1.default.unlink(filePath, (error) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    return;
                }
                else {
                    yield (0, db_1.default)();
                    yield user_1.User.updateOne({ _id, "servers._id": serverId }, { $pull: { "servers.$.backups": { _id: backupId } } });
                }
            }));
            res.status(200).json({ message: "Successful" });
        }
        catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    }),
    backupNow: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { _id } = req.user;
            const { _id: serverId } = req.query;
            const user = yield user_1.User.findOne({ _id, "servers._id": serverId });
            if (!user)
                return res.status(404).json({ message: "User not found" });
            yield (0, createBackup_1.default)(user.servers[0], _id);
            res.status(200).json({ message: "Successfully created a backup." });
        }
        catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    }),
};
exports.default = miniServerController;
