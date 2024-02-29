import axios from "axios";
import { createWriteStream } from "fs";
import { promisify } from "util";
import * as stream from "stream";
import { IAuth } from "../types";

const finished = promisify(stream.finished);

export async function downloadFile(
  fileUrl: string,
  auth: IAuth,
  outputPath: string
): Promise<any> {
  const writer = createWriteStream(outputPath);

  return axios({
    method: "get",
    url: fileUrl,
    responseType: "stream",
    auth: {
      username: auth.username,
      password: auth.password,
    },
  }).then((response) => {
    response.data.pipe(writer);
    return finished(writer);
  });
}
