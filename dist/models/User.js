"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true, versionKey: false });
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=User.js.map