var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
const DBM_URL = "mongodb://localhost:27017/graphqlSmDB?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const dbConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(DBM_URL, {});
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log(error);
    }
});
export default dbConnect;
