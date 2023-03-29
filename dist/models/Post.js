"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true, versionKey: false });
exports.default = mongoose_1.default.model("Post", PostSchema);
//# sourceMappingURL=Post.js.map