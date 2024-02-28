import express, { Express } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import mongoConnection from "./db";
import { User } from "./models/user";
import { encryptData } from "./services/encryption";
import bodyParser from "body-parser";
import miniserverRoutes from "./routes/miniserverRoutes";
import backupTask from "./services/cronService";
import path from "path";

const port: number = 3001;
const app: Express = express();

backupTask.start();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/miniserver", miniserverRoutes);

app.post("/abc", async (req, res) => {
  try {
    await mongoConnection();
    const { email, pass } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    const hashedPassword = await encryptData(pass);

    const newUser = new User({
      email,
      pass: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use(express.static(path.join(__dirname, "/client")));

app.get("*", (_req, res) => {
  const filePath = path.join(__dirname, "/index.html");
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Listening to ${port}`);
});
