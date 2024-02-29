import axios from "axios";

export default async function getLoxoneBackupUrl(
  serial_number: string
): Promise<string | undefined> {
  try {
    const response = await axios.get(
      `https://dns.loxonecloud.com/?getip&snr=${serial_number}&json=true`
    );
    const { IPHTTPS } = response.data;

    const [IP, PORT] = IPHTTPS.split(":");

    const backupUrl = `https://${IP.replace(
      /\./g,
      "-"
    )}.${serial_number}.dyndns.loxonecloud.com:${PORT}/dev/fsget/backup/sps_new.zip`;

    return backupUrl;
  } catch (error) {
    console.log("Error Generating Loxone Backup URL");
  }
}
