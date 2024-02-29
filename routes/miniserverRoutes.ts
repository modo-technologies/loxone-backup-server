import express from "express";
import bodyParser from "body-parser";
import miniserverController from "../controllers/miniserverController";

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/add", miniserverController.addNewServer);
router.put("/edit", miniserverController.editMiniServer);

router.get("/get-miniservers", miniserverController.getMiniservers);
router.get("/get-backups", miniserverController.getBackups);
router.get("/download-backup", miniserverController.downloadBackup);

router.delete("/delete-backup", miniserverController.deleteBackup);
router.delete("/delete-server", miniserverController.deleteServer);
export default router;
