import mongoose, { Schema, Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  profilePic: string;
  dob: string;
  bio: string;
  friendRequests: [string];
  friends: [string];
}

export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema(
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
