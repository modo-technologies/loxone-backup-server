import bcrypt from "bcrypt";

export const encryptData = async (data: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(data, saltRounds).then((hash) => hash);
};

export const decryptData = async (data: string, hash: string) => {
  return new Promise((resolve) => {
    bcrypt.compare(data, hash, (err: Error | undefined, result: boolean) => {
      if (err) {
        throw err;
      }
      if (result) {
        return resolve(true);
      } else return resolve(false);
    });
  });
};
