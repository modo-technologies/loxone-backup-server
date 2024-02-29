import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
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
      miniserver: String,
      name: String,
      serial_number: String,
      backupStatus: String,
      username: String,
      lastBackup: Date,
      password: String,
      backups: [
        {
          fileName: String,
          date: Date,
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
