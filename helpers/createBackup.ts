import generateFileName from "./generateFileName";
import getLoxoneBackupUrl from "./getLoxoneBackupUrl";
import EBS_DIR from "../config";
import { ObjectId } from "mongodb";
import { downloadFile } from "./downloadFile";
import fs from "fs";
import path from "path";
import { IMiniserverDetails } from "../types";
import { User } from "../models/user";

export default async function createBackup(
  server: IMiniserverDetails,
  userId: ObjectId | string
) {
  try {
    const { username, password, serial_number, name, _id: serverId } = server;
    console.log(server);
    const backupUrl = await getLoxoneBackupUrl(serial_number);

    if (!backupUrl) {
      throw Error("Error generating backup url");
    }

    const fileName = generateFileName(name || "name_not_found");

    const outputPath = path.join(
      EBS_DIR,
      userId.toString(),
      serverId?.toString() as string
    );

    fs.mkdirSync(outputPath, { recursive: true });

    await downloadFile(
      backupUrl,
      {
        username,
        password,
      },
      path.join(outputPath, `${fileName}.zip`)
    );

    await User.updateOne(
      { _id: userId, "servers._id": serverId },
      {
        $push: {
          "servers.$.backups": {
            fileName: fileName,
            date: new Date().toISOString(),
          },
        },
      }
    );

    // await uploadFile(
    //   outputPath,
    //   fileName,
    //   userId as ObjectId,
    //   serverId as ObjectId
    // );
  } catch (error) {
    console.error("Error creating backup:", (error as any).message);
  }
}
