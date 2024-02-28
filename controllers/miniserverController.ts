import mongoConnection from "../db";
import { verifyJwt } from "../helpers/verifyJwt";
import { User } from "../models/user";
import { IJwt, IMiniserverController, IMiniserverDetails } from "../types";
import jwt from "jsonwebtoken";

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
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ error: "Invalid or missing access token" });
      }

      const accessToken = authorizationHeader.slice("Bearer ".length);

      const _id = verifyJwt(accessToken, res, req);
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
};
export default miniServerController;
