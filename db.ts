import mongoose from "mongoose";
import "dotenv/config";

const mongoConnection = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("Database Connected");
  } catch (err) {
    console.log(err);
  }
};

export default mongoConnection;
