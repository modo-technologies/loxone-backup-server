import path from "path";
import mongoConnection from "../db";
import { User } from "../models/user";
import {
  IGetUserAuthInfoRequest,
  IMiniserverController,
  IMiniserverDetails,
} from "../types";
import jwt from "jsonwebtoken";
import fs from "fs";

const EBS_DIR = path.join(
  "C:/Users/",
  decodeURIComponent("Tanith%20Flory"),
  `/Documents/`
);

const miniServerController: IMiniserverController = {
  addNewServer: async (req, res) => {
    await mongoConnection();

    try {
      const {
        name,
        serial_number,
        username,
        backupStatus,
        miniserver,
        accessToken,
        lastBackup,
        password,
      }: IMiniserverDetails & { accessToken: string } = req.body;
      const decodedToken = jwt.verify(accessToken, "zcxvbn");
      const { _id }: any = decodedToken;

      const existingServer = await User.findOne({
        _id,
        "servers.serial_number": serial_number,
      });

      if (existingServer) {
        return res
          .status(400)
          .json("Server with the same serial number already exists.");
      }

      await User.updateOne(
        { _id },
        {
          $addToSet: {
            servers: {
              name,
              serial_number,
              username,
              backupStatus,
              miniserver,
              accessToken,
              lastBackup,
              password,
            },
          },
        }
      );

      res.status(200).send("Server added successfully.");
    } catch (error) {
      console.log(error);
    }
  },

  getMiniservers: async (req, res) => {
    try {
      const { _id } = (req as IGetUserAuthInfoRequest).user;

      await mongoConnection();
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const miniservers = user.servers;
      res.status(200).json({ miniservers });
    } catch (error) {
      console.error("Error fetching miniservers:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getBackups: async (req, res) => {
    try {
      await mongoConnection();
      const { _id } = (req as IGetUserAuthInfoRequest).user;

      const { _id: serverId } = req.query;

      const user = await User.findOne(
        { _id },
        { servers: { $elemMatch: { _id: serverId } } }
      );
      if (!user) {
        throw "User Not Found";
      }

      if (user.servers[0].backups.length === 0) {
        throw "No backups found";
      }

      return res.status(200).json({ backups: user?.servers[0].backups });
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  },

  downloadBackup: async (req, res) => {
    try {
      const { _id } = (req as IGetUserAuthInfoRequest).user;
      const { _id: serverId, fileName } = req.query;

      const filePath = path.join(
        EBS_DIR,
        _id,
        serverId as string,
        `${fileName}.zip`
      );

      if (fs.existsSync(filePath)) {
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}.zip`
        );
        res.setHeader("Content-Type", "application/zip");
        res.download(filePath, (err) => {
          if (err) {
            console.error("Error downloading file:", err);
            res.status(500).send("Internal Server Error");
          }
        });
      } else {
        res.status(404).send("File not found");
      }
    } catch (error) {}
  },
};
export default miniServerController;
