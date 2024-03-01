import path from "path";
import mongoConnection from "../db";
import { User } from "../models/user";
import {
  IGetUserAuthInfoRequest,
  IMiniserverController,
  IMiniserverDetails,
} from "../types";
import fs from "fs";
import EBS_DIR from "../config";
import validateServer from "../helpers/validateServer";
import { decryptData } from "../services/encryption";
const rimraf = require("rimraf");

const miniServerController: IMiniserverController = {
  addNewServer: async (req, res) => {
    try {
      const {
        name,
        serial_number,
        username,
        backupStatus,
        miniserver,
        lastBackup,
        password,
      }: IMiniserverDetails & { accessToken: string } = req.body;
      const { _id } = (req as IGetUserAuthInfoRequest).user;

      if (!validateServer(req.body)) {
        return res.status(400).json({ message: "Missing Fields" });
      }

      await mongoConnection();
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

  editMiniServer: async (req, res) => {
    try {
      const {
        name,
        serial_number,
        username,
        backupStatus,
        miniserver,
        lastBackup,
        password,
      }: IMiniserverDetails & { accessToken: string } = req.body;
      const { _id } = (req as IGetUserAuthInfoRequest).user;
      if (!validateServer(req.body)) {
        return res.status(400).json({ message: "Missing Fields" });
      }

      await mongoConnection();

      await User.updateOne(
        { _id, "servers.serial_number": serial_number },
        {
          $set: {
            "servers.$.name": name,
            "servers.$.username": username,
            "servers.$.backupStatus": backupStatus,
            "servers.$.miniserver": miniserver,
            "servers.$.lastBackup": lastBackup,
            "servers.$.password": password,
          },
        }
      );

      res
        .status(200)
        .json({ message: "Successfully edited the server details." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
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

  deleteServer: async (req, res) => {
    try {
      const { _id } = (req as IGetUserAuthInfoRequest).user;

      const { pass, _id: serverId } = req.body;

      await mongoConnection();

      const user = await User.findOne({ _id });

      if (!user) return res.status(404).json({ message: "User not found" });

      const verifyPass = await decryptData(pass as string, user.pass);

      if (!verifyPass) {
        return res.status(401).json({ message: "Invalid password." });
      }

      fs.rmdir(path.join(EBS_DIR, _id, serverId), async (error) => {
        if (error) return;
        
        await User.updateOne(
          { _id, "servers._id": serverId },
          { $pull: { servers: { _id: serverId } } }
        );
      });

      res.status(200).json({ message: "Successfully deleted the server" });
    } catch (error) {
      console.log(error);
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
        return res.status(404).json({ message: "User not found" });
      }
      if (user.servers[0].backups.length === 0) {
        return res.status(404).json({ message: "Backups not found" });
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

      if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
      }

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
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  },

  deleteBackup: async (req, res) => {
    try {
      const { _id } = (req as IGetUserAuthInfoRequest).user;
      const { _id: serverId, fileName, backupId } = req.query;

      const filePath = path.join(
        EBS_DIR,
        _id,
        serverId as string,
        `${fileName}.zip`
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      fs.unlink(filePath, async (error) => {
        if (error) {
          return;
        } else {
          await mongoConnection();

          await User.updateOne(
            { _id, "servers._id": serverId },
            { $pull: { "servers.$.backups": { _id: backupId } } }
          );
        }
      });

      res.status(200).json({ message: "Successful" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  },
};
export default miniServerController;
