import mongoose from "mongoose";
import Types from 'mongoose'


export interface IMessage {
  conversationId: string;
  sender: string;
  text: string;
}

export interface IMessageModel extends IMessage, mongoose.Document {}

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMessageModel>("Message", MessageSchema);
