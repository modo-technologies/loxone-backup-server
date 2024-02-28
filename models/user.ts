import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  _id: ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pass: {
    type: String,
    default: null,
  },
  servers: [
    {
      _id: ObjectId,
      miniserver: String,
      name: String,
      serial_number: String,
      backupStatus: String,
      username: String,
      lastBackup: Date,
      password: String,
      backups: [
        {
          url: String,
          logs: [
            {
              text: String,
              date: Date,
            },
          ],
        },
      ],
    },
  ],
});

export const User = mongoose.model("User", usersSchema);
