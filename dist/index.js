"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const miniserverRoutes_1 = __importDefault(require("./routes/miniserverRoutes"));
const cronService_1 = __importDefault(require("./services/cronService"));
const path_1 = __importDefault(require("path"));
const authenticateToken_1 = __importDefault(require("./middlewares/authenticateToken"));
const rateLimiter_1 = __importStar(require("./middlewares/rateLimiter"));
const helmet_1 = __importDefault(require("helmet"));
const miniserverController_1 = __importDefault(require("./controllers/miniserverController"));
require("dotenv").config();
const port = 3001;
const app = (0, express_1.default)();
cronService_1.default.start();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/api/auth", rateLimiter_1.default, authRoutes_1.default);
app.post("/api/miniserver/backup-now", rateLimiter_1.backupLimiter, authenticateToken_1.default, miniserverController_1.default.backupNow);
app.use("/api/miniserver", rateLimiter_1.default, authenticateToken_1.default, miniserverRoutes_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "/client")));
app.get("*", (_req, res) => {
    const filePath = path_1.default.join(__dirname, "/client/index.html");
    res.sendFile(filePath);
});
app.listen(port, () => {
    console.log(`Listening to ${port}`);
});
