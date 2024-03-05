import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

export interface IMiniserverDetails {
  name: string;
  serial_number: string;
  username: string;
  backupStatus: Status;
  _id: ObjectId;
  isChecked?: boolean;
  miniserver: string;
  lastBackup: Date;
  password: string;
  backups: [
    {
      url: string;
      logs: [
        {
          text: string;
          date: Date;
        }
      ];
    }
  ];
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
  changePass(req: Request, res: Response): Promise<any>;
}
export interface IMiniserverController {
  addNewServer(req: Request, res: Response): Promise<any>;
  editMiniServer(req: Request, res: Response): Promise<any>;
  getMiniservers(req: Request, res: Response): Promise<any>;
  deleteServer(req: Request, res: Response): Promise<any>;
  getBackups(req: Request, res: Response): Promise<any>;
  downloadBackup(req: Request, res: Response): Promise<any>;
  deleteBackup(req: Request, res: Response): Promise<any>;
  backupNow(req: Request, res: Response): Promise<any>;
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
export interface IGetUserAuthInfoRequest extends Request {
  user: IJwt;
}

export type RequestResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export interface ILoginDetails {
  email: string;
  pass: string;
}
