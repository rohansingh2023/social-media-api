import mongoose from "mongoose";

const DBM_URL =
  "mongodb://localhost:27017/graphqlSmDB?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const dbConnect = async () => {
  try {
    await mongoose.connect(DBM_URL, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
