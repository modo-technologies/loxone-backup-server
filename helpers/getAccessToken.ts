import jwt from "jsonwebtoken";
import { IJwt } from "../types";
export const getAccessToken = (payload: IJwt) => {
  const accessToken = jwt.sign(payload, "zcxvbn", {
    expiresIn: "365d",
  });
  return accessToken;
};

export default getAccessToken;
