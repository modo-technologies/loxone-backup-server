import cron from "node-cron";
import mongoConnection from "../db";
import { User } from "../models/user";
import { IMiniserverDetails } from "../types";
import createBackup from "../helpers/createBackup";

const backupTask = cron.schedule("*/10 * * * * *", async () => {
  return;
  try {
    await mongoConnection();

    const database = await User.find({});

    for (const data of database) {
      const { _id: userId } = data;
      for (const server of data.servers) {
        await createBackup(server as IMiniserverDetails, userId);
      }
    }
  } catch (error: unknown) {
    console.error("Error creating backup:", (error as any).message);
  }
});

export default backupTask;
