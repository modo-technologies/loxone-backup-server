import { createWriteStream, unlink } from "fs";
import axios from "axios";
import { finished } from "stream";
import { promisify } from "util";
import { IAuth } from "../types";

const finishedAsync = promisify(finished);
const unlinkAsync = promisify(unlink);

export async function downloadFile(
  fileUrl: string,
  auth: IAuth,
  outputPath: string
): Promise<any> {
  const writer = createWriteStream(outputPath);

  writer.on("finish", async () => {
    console.log("File downloaded successfully");
  });

  writer.on("error", async (error) => {
    console.error("Error writing to file:", error.message);

    try {
      await unlinkAsync(outputPath);
      console.log("Incomplete file removed.");
    } catch (unlinkError) {
      console.error("Error removing incomplete file:", unlinkError);
    }
  });

  try {
    const response = await axios({
      method: "get",
      url: fileUrl,
      responseType: "stream",
      auth: {
        username: auth.username,
        password: auth.password,
      },
    });

    response.data.pipe(writer);

    await Promise.race([
      finishedAsync(writer),
      new Promise((_, reject) => writer.on("error", reject)),
    ]);
  } catch (error) {
    throw error;
  }
}
