import mongoConnection from "../db";
import { encryptData, decryptData } from "../services/encryption";
import {
  IAuthController,
  IUserDetails,
  ILoginDetails,
  IGetUserAuthInfoRequest,
} from "../types";
import { User } from "../models/user";
import getAccessToken from "../helpers/getAccessToken";

const authController: IAuthController = {
  signUp: async (req, res) => {
    try {
      const { email, pass }: IUserDetails = req.body;

      await mongoConnection();
      const response = await User.findOne({ email });

      if (!response) {
        const hashedPass = await encryptData(pass);

        const user = new User({
          email: email,
          pass: hashedPass,
        });
        await user.save();
        return res.status(200).json({ message: "User created." });
      }

      return res.status(200).json({ message: "User already exists." });
    } catch (err: unknown) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  loginHandler: async (req, res) => {
    try {
      const { email, pass }: ILoginDetails = req.body;
      await mongoConnection();
      const response = await User.findOne({ email });
      if (!response) {
        return res.status(404).json({ message: "User doesn't exist! " });
      }

      const hashedPass = response.pass;
      const { _id } = response;
      const verifyPass = await decryptData(pass, hashedPass);

      if (!verifyPass) {
        return res.status(401).json({ message: "Invalid Password" });
      }
      const accessToken = getAccessToken({
        _id: _id.toString(),
        email,
      });

      await User.updateOne({ email }, { $set: { accessToken } });

      res.status(200).json(accessToken);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  changePass: async (req, res) => {
    try {
      const { _id } = (req as IGetUserAuthInfoRequest).user;
      const { newPassword, currentPassword } = req.body;
      if (!newPassword || !currentPassword) {
        return res.status(422).json({ message: "Missing Parameters" });
      }

      const user = await User.findOne({ _id });

      if (!user) {
        return res.status(404).json({ message: "User doesn't exist! " });
      }

      const verifyPass = await decryptData(currentPassword, user.pass);
      if (!verifyPass) {
        return res
          .status(401)
          .json({ message: "Invalid Password. Enter your SafeSync password." });
      }

      const hashPass = await encryptData(newPassword);

      await User.findOneAndUpdate({ _id }, { $set: { pass: hashPass } });

      res.status(200).json({ message: "Successful" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};
export default authController;
