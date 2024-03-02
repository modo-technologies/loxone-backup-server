import express, { Express } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import bodyParser from "body-parser";
import miniserverRoutes from "./routes/miniserverRoutes";
import backupTask from "./services/cronService";
import path from "path";
import authenticateToken from "./middlewares/authenticateToken";
import limiter from "./middlewares/rateLimiter";
import helmet from "helmet";
import authController from "./controllers/authController";
require('dotenv').config()

const port: number = 3001;
const app: Express = express();

backupTask.start();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.post("/api/auth/change-pass", authenticateToken, authController.changePass);

app.use("/api/miniserver", limiter, authenticateToken, miniserverRoutes);

app.use(express.static(path.join(__dirname, "/client")));

app.get("*", (_req, res) => {
  const filePath = path.join(__dirname, "/index.html");
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Listening to ${port}`);
});
