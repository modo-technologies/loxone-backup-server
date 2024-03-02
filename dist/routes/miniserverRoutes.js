"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const miniserverController_1 = __importDefault(require("../controllers/miniserverController"));
const router = express_1.default.Router();
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.post("/add", miniserverController_1.default.addNewServer);
router.put("/edit", miniserverController_1.default.editMiniServer);
router.get("/get-miniservers", miniserverController_1.default.getMiniservers);
router.get("/get-backups", miniserverController_1.default.getBackups);
router.get("/download-backup", miniserverController_1.default.downloadBackup);
router.delete("/delete-backup", miniserverController_1.default.deleteBackup);
router.delete("/delete-server", miniserverController_1.default.deleteServer);
exports.default = router;
