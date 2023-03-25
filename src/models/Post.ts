import Types from "mongoose";

import mongoose from "mongoose";

export interface IPost {
  username: string;
  title: string;
  content: string;
  image: string;
  likes: [string];
  comments: [string];
}

export interface IPostModel extends IPost, mongoose.Document {}

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    likes: [
      {
        name: String,
        email: String,
        createdAt: String,
      },
    ],
    comments: [
      {
        name: String,
        email: String,
        body: String,
        createdAt: String,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Post", PostSchema);
