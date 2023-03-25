import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    dob: {
      type: String,
    },
    bio: {
      type: String,
    },
    friendRequests: [
      {
        userId: String,
        name: String,
        email: String,
        profilePic: String,
        createdAt: String,
      },
    ],
    friends: [
      {
        userId: String,
        name: String,
        email: String,
        profilePic: String,
        createdAt: String,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);
export default mongoose.model("User", UserSchema);
