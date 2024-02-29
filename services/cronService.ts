import cron from "node-cron";
import mongoConnection from "../db";
import { User } from "../models/user";
import axios from "axios";
import { downloadFile } from "../helpers/downloadFile";
import generateFileName from "../helpers/generateFileName";
import path from "path";
import fs from "fs";
import { IMiniserverDetails } from "../types";
import getLoxoneBackupUrl from "../helpers/getLoxoneBackupUrl";
import createBackup from "../helpers/createBackup";

const EBS_DIR = path.join(
  "C:/Users/",
  decodeURIComponent("Tanith%20Flory"),
  `/Documents/`
);

const backupTask = cron.schedule("*/10 * * * * *", async () => {
  try {
    await mongoConnection();

    const database = await User.find({});

    for (const data of database) {
      const { _id: userId } = data;
      for (const server of data.servers) {
        const { username, password } = server as IMiniserverDetails;

        if (!username || !password) {
          throw Error("Username or password found");
        }

        await createBackup(server as IMiniserverDetails, userId);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

export default backupTask;
