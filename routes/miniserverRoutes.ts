import express from "express";
import bodyParser from "body-parser";
import { RequestResponse } from "../types";
import miniserverController from "../controllers/miniserverController";

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const addNewServer: RequestResponse = (req, res) => {
  miniserverController.addNewServer(req, res);
};
router.post("/add-new-server", addNewServer);

const getMiniservers: RequestResponse = (req, res) => {
  miniserverController.getMiniservers(req, res);
};
router.get("/get-miniservers", getMiniservers);

export default router;
