import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const verifyJwt = (token: string, res: Response, req: Request) => {
  try {
    const { _id }: any = jwt.verify(token, "zcxvbn");

    return _id;
  } catch (err) {
    // req.redirect("/");
    res.status(400);
  }
};
