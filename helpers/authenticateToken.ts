import { NextFunction, Request, Response } from "express";
import { IGetUserAuthInfoRequest, IJwt } from "../types";

import jwt from "jsonwebtoken";

export default function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid or missing access token" });
  }

  const accessToken = authHeader.slice("Bearer ".length);

  const user = jwt.verify(accessToken, "zcxvbn") as IJwt;
  (req as IGetUserAuthInfoRequest).user = user;

  next();
}

module.exports = authenticateToken;
