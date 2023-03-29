"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DBM_URL = "mongodb+srv://rohan:1kHZzHhbqTdEuCQn@cluster0.sgvxcek.mongodb.net/?retryWrites=true&w=majority";
const dbConnect = async () => {
    try {
        await mongoose_1.default.connect(DBM_URL, {});
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = dbConnect;
//# sourceMappingURL=db.js.map