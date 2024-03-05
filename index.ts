import express, { Express } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import bodyParser from "body-parser";
import miniserverRoutes from "./routes/miniserverRoutes";
import backupTask from "./services/cronService";
import path from "path";
import authenticateToken from "./middlewares/authenticateToken";
import limiter, { backupLimiter } from "./middlewares/rateLimiter";
import helmet from "helmet";
import authController from "./controllers/authController";
import miniServerController from "./controllers/miniserverController";
require("dotenv").config();

const port: number = 3001;
const app: Express = express();

backupTask.start();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", limiter, authRoutes);

app.post(
  "/api/miniserver/backup-now",
  backupLimiter,
  authenticateToken,
  miniServerController.backupNow
);
app.use("/api/miniserver", limiter, authenticateToken, miniserverRoutes);

app.use(express.static(path.join(__dirname, "/client")));

app.get("*", (_req, res) => {
  const filePath = path.join(__dirname, "/client/index.html");
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Listening to ${port}`);
});
