import { NextFunction, Request, Response } from "express";
import { IGetUserAuthInfoRequest, IJwt } from "../types";

import jwt from "jsonwebtoken";
import mongoConnection from "../db";
import { User } from "../models/user";

export default async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Invalid or missing access token" });
    }

    const accessToken = authHeader.slice("Bearer ".length);

    const user = jwt.verify(accessToken, "zcxvbn") as IJwt;
    (req as IGetUserAuthInfoRequest).user = user;

    await mongoConnection();

    const userDetails = await User.findOne({ _id: user._id });

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!(userDetails.accessToken === accessToken)) {
      return handleInvalidToken(res);
    }

    next();
  } catch (error) {
    console.log("Issue with JWT.");
    handleInvalidToken(res);
  }
}

function handleInvalidToken(res: Response) {
  res.setHeader("Clear-Token", "true");

  res.setHeader("Access-Control-Expose-Headers", "Clear-Token");
  return res.status(401).json({ message: "Invalid Token" });
}

module.exports = authenticateToken;
