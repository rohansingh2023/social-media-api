import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBM_URL =
  "mongodb+srv://rohan:1kHZzHhbqTdEuCQn@cluster0.sgvxcek.mongodb.net/?retryWrites=true&w=majority";

const dbConnect = async () => {
  try {
    await mongoose.connect(DBM_URL, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
