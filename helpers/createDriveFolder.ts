import { drive_v3 } from "googleapis";

export default async function createDriveFolder(
  folderName: string,
  drive: drive_v3.Drive,
  parentFolderId?: string
) {
  try {
    const rootFolder = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
      fields: "files(id)",
    });

    let folderId: string | null | undefined;
    if (rootFolder.data.files?.length === 0) {
      const response = await drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: "application/vnd.google-apps.folder",
          parents: parentFolderId ? [parentFolderId] : [],
        },
        fields: "id",
      });

      folderId = response.data.id;
    } else {
      folderId = rootFolder.data.files?.[0].id;
    }
    
    return folderId as string;
  } catch (error) {
    throw "Failed to create folder id";
  }
}
