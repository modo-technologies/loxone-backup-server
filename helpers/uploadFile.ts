import { google } from "googleapis";
import { createReadStream } from "fs";
import "dotenv/config";
import { ObjectId } from "mongodb";
import createDriveFolder from "./createDriveFolder";
import { User } from "../models/user";

const OAuth2 = google.auth.OAuth2;

const { OAUTH_CLIENT_SECRET, OAUTH_CLIENTID, OAUTH_REFRESH_TKN, REDIRECT_URI } =
  process.env;

const scopes = ["https://www.googleapis.com/auth/drive"];

const oauth2Client = new OAuth2(
  OAUTH_CLIENTID,
  OAUTH_CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: OAUTH_REFRESH_TKN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

export default async function uploadFile(
  filePath: string,
  fileName: string,
  userId: ObjectId,
  serverId: ObjectId
) {
  try {
    const userFolderId = await createDriveFolder(userId.toString(), drive);

    const serverFolderId = await createDriveFolder(
      serverId.toString(),
      drive,
      userFolderId
    );

    const media = {
      mimeType: "application/zip",
      body: createReadStream(filePath),
    };

    await drive.files.create({
      media,
      fields: "id",
      requestBody: {
        name: fileName,
        parents: [serverFolderId as string],
      },
    });
    
  } catch (error) {
    console.error(
      "Error uploading file to Google Drive:",
      (error as any).message
    );
    throw error;
  }
}
