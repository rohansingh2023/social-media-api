import mongoose from "mongoose";
import Types from 'mongoose'


export interface IConversation {
  members: string[];
}

export interface IConversationModel extends IConversation, mongoose.Document {}

const ConversationSchema = new mongoose.Schema(
  {
    members: [
      {
        sender: String,
        receiver: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);
