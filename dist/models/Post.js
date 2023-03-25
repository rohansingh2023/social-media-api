import mongoose from "mongoose";
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
