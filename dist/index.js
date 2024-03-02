"use strict";
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
const rateLimiter_1 = __importDefault(require("./middlewares/rateLimiter"));
const helmet_1 = __importDefault(require("helmet"));
const authController_1 = __importDefault(require("./controllers/authController"));
require('dotenv').config();
const port = 3001;
const app = (0, express_1.default)();
cronService_1.default.start();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes_1.default);
app.post("/api/auth/change-pass", authenticateToken_1.default, authController_1.default.changePass);
app.use("/api/miniserver", rateLimiter_1.default, authenticateToken_1.default, miniserverRoutes_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "/client")));
app.use(function (req, res, next) {
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
});
app.get("*", (_req, res) => {
    const filePath = path_1.default.join(__dirname, "/index.html");
    res.sendFile(filePath);
});
app.listen(port, () => {
    console.log(`Listening to ${port}`);
});
