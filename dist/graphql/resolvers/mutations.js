"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const cloudinary_1 = require("cloudinary");
dotenv.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.default = {
    addPost: async (parent, args, { models, user }) => {
        if (!user) {
            throw new apollo_server_express_1.AuthenticationError("You must login to create a new book");
        }
        const photoUrl = await cloudinary_1.v2.uploader.upload(args.image);
        return models.Post.create({
            content: args.content,
            image: photoUrl.url,
            user: new mongoose_1.default.Types.ObjectId(user.id),
        });
    },
    updatePost: async (parent, { id, content, image }, { models }) => {
        return await models.Post.findOneAndUpdate({
            _id: id,
        }, {
            $set: {
                content,
                image,
            },
        }, {
            new: true,
        });
    },
    deletePost: async (parent, { id }, { models }) => {
        try {
            await models.Post.findOneAndRemove({ _id: id });
            return true;
        }
        catch (err) {
            return false;
        }
    },
    register: async (parent, { name, email, password, profilePic, dob, bio }, { models }) => {
        // normalize email address
        email = email.trim().toLowerCase();
        const user = await models.User.findOne({
            email,
        });
        // if there is no user, throw an authentication error
        if (user) {
            throw new apollo_server_express_1.AuthenticationError("User already exists. Try with a different emailId");
        }
        // hash the password
        const hashed = await bcrypt_1.default.hash(password, 10);
        const photoUrl = await cloudinary_1.v2.uploader.upload(profilePic);
        // create the gravatar url
        try {
            const user = await models.User.create({
                name,
                email,
                password: hashed,
                profilePic: photoUrl.url,
                bio,
                dob,
            });
            // create and return the json web token
            return jsonwebtoken_1.default.sign({ id: user._id, name: user.name, email: user.email }, "secret");
        }
        catch (err) {
            console.log(err);
            throw new Error("Error creating account");
        }
    },
    login: async (parent, { email, password }, { models }) => {
        // try {
        if (email) {
            email = email.trim().toLowerCase();
        }
        const user = await models.User.findOne({
            email,
        });
        // if there is no user, throw an authentication error
        if (!user) {
            throw new apollo_server_express_1.AuthenticationError("User doesn't exists");
        }
        // if the passwords don't match, throw an authentication error
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            throw new apollo_server_express_1.AuthenticationError("Passwords do not match");
        }
        // create and return the json web token
        const token = jsonwebtoken_1.default.sign({ id: user._id, name: user.name, email: user.email }, "secret");
        return {
            token,
            user,
            message: "Successfully signed in",
        };
        // } catch (error) {
        //   console.log(error);
        //   throw new Error("Error logging in");
        // }
    },
    updateUser: async (_, { name, email, profilePic, dob, bio }, { models, user }) => {
        if (!user) {
            throw new apollo_server_express_1.AuthenticationError("You must login to update");
        }
        return await models.User.findOneAndUpdate({
            _id: user.id,
        }, {
            $set: {
                name,
                email,
                profilePic,
                dob,
                bio,
            },
        }, {
            new: true,
        });
    },
    likePost: async (_, { id }, { models, user }) => {
        if (!user) {
            throw new apollo_server_express_1.AuthenticationError("You must login to like a post");
        }
        const post = await models.Post.findById(id);
        if (post) {
            if (post.likes.find((like) => like.email === user.email)) {
                // Post already liked, unlike it
                post.likes = post.likes.filter((like) => like.email !== user.email);
            }
            else {
                // Post not liked, like it
                post.likes.push({
                    name: user.name,
                    email: user.email,
                    createdAt: new Date().toISOString(),
                });
            }
            await post.save();
            return post;
        }
        else {
            throw new Error("Post not found");
        }
    },
    createComment: async (_, { postId, body }, { models, user }) => {
        if (!user) {
            throw new apollo_server_express_1.AuthenticationError("You must login to create a comment");
        }
        if (body.trim() === "") {
            throw new apollo_server_express_1.UserInputError("Comment body must not be empty", {
                errors: {
                    body: "Comment body must not be empty",
                },
            });
        }
        const post = await models.Post.findById(postId);
        if (post) {
            post.comments.unshift({
                body,
                name: user.name,
                email: user.email,
                createdAt: new Date().toISOString(),
            });
            await post.save();
            return post;
        }
        else
            throw new apollo_server_express_1.UserInputError("Post not found");
    },
    deleteComment: async (_, { postId, commentId }, { models, user }) => {
        if (!user) {
            throw new apollo_server_express_1.AuthenticationError("You must login to delete a comment");
        }
        const post = await models.Post.findById(postId);
        if (post) {
            const commentIndex = post.comments.findIndex((c) => c.id === commentId);
            if (post.comments[commentIndex].email === user.email) {
                post.comments.splice(commentIndex, 1);
                await post.save();
                return post;
            }
            else {
                throw new apollo_server_express_1.AuthenticationError("You can only delete your own comments");
            }
        }
        else {
            throw new apollo_server_express_1.UserInputError("Post not found");
        }
    },
    friendRequest: async (_, { id }, { models, user }) => {
        try {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError("You must login to send a friend request");
            }
            const userTo = await models.User.findById(id);
            const userFrom = await models.User.findById(user.id);
            if (userTo.friendRequests.find((f) => f.id === userFrom.id)) {
                userTo.friendRequests = userTo.friendRequests.filter((f) => f.id !== userFrom.id);
            }
            else {
                userTo.friendRequests.push({
                    userId: userFrom.id,
                    email: userFrom.email,
                    name: userFrom.name,
                    profilePic: userFrom.profilePic,
                    createdAt: new Date().toISOString(),
                });
                await userTo.save();
                return userTo;
            }
        }
        catch (error) {
            throw new Error("Error sending friend request");
        }
    },
    acceptFriendRequest: async (_, { email }, { models, user }) => {
        try {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError("You must login to accept a friend request");
            }
            const requestSender = await models.User.findOne({ email });
            const requestReceiver = await models.User.findById(user.id);
            if (!requestReceiver.friends.find((f) => f.email === email) &&
                !requestSender.friends.find((f) => f.email === requestReceiver.email)) {
                requestReceiver.friends.push({
                    userId: requestSender.id,
                    name: requestSender.name,
                    email: requestSender.email,
                    profilePic: requestSender.profilePic,
                    createdAt: new Date().toISOString(),
                });
                requestSender.friends.push({
                    userId: requestReceiver.id,
                    name: requestReceiver.name,
                    email: requestReceiver.email,
                    profilePic: requestReceiver.profilePic,
                    createdAt: new Date().toISOString(),
                });
                // requestReceiver.friendRequests.filter((f: any) => f.email === email);
                // requestReceiver.friendRequests.remove({ email: email });
                await models.User.updateOne({ _id: requestReceiver.id }, { $pull: { friendRequests: { email: email } } });
                // requestReceiver.friendRequests.pull({ email: email });
                await requestReceiver.save();
                await requestSender.save();
                return requestReceiver;
            }
            else {
                throw new apollo_server_express_1.UserInputError("Already Friends");
            }
        }
        catch (error) {
            throw new Error("Error accepting friend request");
        }
    },
    declineFriendRequest: async (_, { email }, { models, user }) => {
        try {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError("You must login to accept a friend request");
            }
            const me = await models.User.findById(user.id);
            // const reqSender = await models.User.findOne({ email });
            await models.User.updateOne({ _id: me.id }, { $pull: { friendRequests: { email: email } } });
            await me.save();
        }
        catch (err) {
            throw new Error("Error declining friend request");
        }
    },
    unFriend: async (_, { email }, { models, user }) => {
        try {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError("You must login to accept a friend request");
            }
            const friend = await models.User.findOne({ email });
            const currentUser = await models.User.findById(user.id);
            if (currentUser.friends.find((f) => f.email === friend.email)) {
                await models.User.updateOne({ _id: currentUser.id }, { $pull: { friends: { email: friend.email } } });
                await models.User.updateOne({ _id: friend.id }, { $pull: { friends: { email: currentUser.email } } });
                await friend.save();
                await currentUser.save();
                return friend;
            }
            else {
                throw new apollo_server_express_1.UserInputError("Not in my friends List");
            }
        }
        catch (error) {
            throw new Error("Error in unfriending");
        }
    },
    createConversation: async (_, { sender, receiver }, { models }) => {
        const conv = new models.Conversation({
            members: [{ sender, receiver }],
        });
        try {
            const saveConv = await conv.save();
            return saveConv;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error in creating conversation");
        }
    },
};
//# sourceMappingURL=mutations.js.map