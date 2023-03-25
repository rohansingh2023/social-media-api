import mongoose from "mongoose";
const ConversationSchema = new mongoose.Schema({
    members: [
        {
            sender: String,
            receiver: String,
        },
    ],
}, { timestamps: true });
export default mongoose.model("Conversation", ConversationSchema);
