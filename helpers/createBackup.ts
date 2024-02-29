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
  userId: ObjectId
) {
  try {
    const { username, password, serial_number, name, _id: serverId } = server;

    const backupUrl = await getLoxoneBackupUrl(serial_number);

    if (!backupUrl) {
      throw "Error generating backup url";
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
            path: path.join(outputPath, `${fileName}.zip`),
            fileName: fileName,
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
    console.error(error);
  }
}
