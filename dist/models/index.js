"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = __importDefault(require("./Post"));
const User_1 = __importDefault(require("./User"));
const Conversation_1 = __importDefault(require("./Conversation"));
const Message_1 = __importDefault(require("./Message"));
const models = { Post: Post_1.default, User: User_1.default, Conversation: Conversation_1.default, Message: Message_1.default };
exports.default = models;
//# sourceMappingURL=index.js.map