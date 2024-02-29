import { IMiniserverDetails } from "../types";

export default function validateServer(server: IMiniserverDetails) {
  const requiredFields = [
    server.name,
    server.serial_number,
    server.username,
    server.miniserver,
    server.backupStatus,
    server.password,
  ];

  return requiredFields.every((field) => field?.trim());
}
