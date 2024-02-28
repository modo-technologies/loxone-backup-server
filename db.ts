import mongoose from "mongoose";

const mongoConnection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://tanith:4gVaufELIV0GrBQF@cluster0.glj6qqi.mongodb.net/modo_backup`
    );
    console.log("Database Connected");
  } catch (err) {
    console.log(err);
  }
};

export default mongoConnection;
