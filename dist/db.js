"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DBM_URL = "mongodb://localhost:27017/graphqlSmDB?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
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