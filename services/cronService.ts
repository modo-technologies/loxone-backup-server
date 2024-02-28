import cron from "node-cron";
import mongoConnection from "../db";
import { User } from "../models/user";
import axios from "axios";
import { downloadFile } from "../helpers/downloadFile";
import generateFileName from "../helpers/generateFileName";
import path from "path";
import uploadFile from "../helpers/uploadFile";
import { ObjectId } from "mongodb";
import fs from "fs";

const backupTask = cron.schedule("0 0 * * *", async () => {
  await mongoConnection();

  const database = await User.find({});

  for (const data of database) {
    const { _id: userId } = data;
    for (const server of data.servers) {
      const { username, password, serial_number, name, _id: serverId } = server;

      if (!username || !password) {
        throw Error("No username, password found");
      }

      try {
        const response = await axios.get(
          `https://dns.loxonecloud.com/?getip&snr=${serial_number}&json=true`
        );
        const { IPHTTPS } = response.data;

        const [IP, PORT] = IPHTTPS.split(":");

        const backupUrl = `https://${IP.replace(
          /\./g,
          "-"
        )}.${serial_number}.dyndns.loxonecloud.com:${PORT}/dev/fsget/backup/sps_new.zip`;

        const fileName = generateFileName(name || "name_not_found");

        const outputPath = path.join(
          "C:/Users/",
          decodeURIComponent("Tanith%20Flory"),
          `/Documents/${fileName}.zip`
        );

        await downloadFile(
          backupUrl,
          {
            username,
            password,
          },
          outputPath
        );

        await uploadFile(
          outputPath,
          fileName,
          userId as ObjectId,
          serverId as ObjectId
        );

        fs.unlink(outputPath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log(`File ${outputPath} has been deleted.`);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
});

export default backupTask;
