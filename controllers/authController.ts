import mongoConnection from "../db";
import { encryptData, decryptData } from "../services/encryption";
import { IAuthController, IUserDetails, ILoginDetails } from "../types";
import { User } from "../models/user";
import getAccessToken from "../helpers/getAccessToken";

const authController: IAuthController = {
  signUp: async (req, res) => {
    try {
      console.log("ac");
      const { email, pass }: IUserDetails = req.body;
      const otp = Math.floor(Math.random() * 600000) + 100000;

      await mongoConnection();
      const response = await User.findOne({ email });

      if (!response) {
        const hashedPass = await encryptData(pass);

        const user = new User({
          email: email,
          pass: hashedPass,
        });
        await user.save();
        return res.status(200).json({ message: "OK" });
      }

      return res.status(200).json({ message: "OK" });
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

      res.status(200).json(accessToken);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
};
export default authController;
