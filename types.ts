import express, { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IMiniserverDetails {
  name: string;
  serial_number: string;
  username: string;
  backupStatus: Status;
  _id: number;
  isChecked?: boolean;
  miniserver?: string;
  lastBackup: Date;
  password: string;
}

export type Status = "daily" | "weekly" | "monthly" | "no_backup";

export type CronExpression = {
  [key in Status]: string | null;
};

export interface IAuth {
  username: string;
  password: string;
}

export interface IAuthController {
  signUp(req: Request, res: Response): Promise<any>;
  loginHandler(req: Request, res: Response): Promise<any>;
}
export interface IMiniserverController {
  addNewServer(req: Request, res: Response): Promise<any>;
  getMiniservers(req: Request, res: Response): Promise<any>;
}
export interface IUserDetails {
  email: string;
  userName: string;
  pass: string;
}

export interface IJwt {
  _id: string;
  email: string;
}

export type RequestResponse = (
  req: express.Request,
  res: express.Response
) => void;

export interface ILoginDetails {
  email: string;
  pass: string;
}
