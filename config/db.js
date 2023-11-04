import mongoose from "mongoose";

// DB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB is connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
