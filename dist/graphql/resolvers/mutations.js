var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export default {
    addPost: (parent, args, { models, user }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new AuthenticationError("You must login to create a new book");
        }
        const photoUrl = yield cloudinary.uploader.upload(args.image);
        return models.Post.create({
            content: args.content,
            image: photoUrl.url,
            user: new mongoose.Types.ObjectId(user.id),
        });
    }),
    updatePost: (parent, { id, content, image }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        return yield models.Post.findOneAndUpdate({
            _id: id,
        }, {
            $set: {
                content,
                image,
            },
        }, {
            new: true,
        });
    }),
    deletePost: (parent, { id }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield models.Post.findOneAndRemove({ _id: id });
            return true;
        }
        catch (err) {
            return false;
        }
    }),
    register: (parent, { name, email, password, profilePic, dob, bio }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        // normalize email address
        email = email.trim().toLowerCase();
        const user = yield models.User.findOne({
            email,
        });
        // if there is no user, throw an authentication error
        if (user) {
            throw new AuthenticationError("User already exists. Try with a different emailId");
        }
        // hash the password
        const hashed = yield bcrypt.hash(password, 10);
        const photoUrl = yield cloudinary.uploader.upload(profilePic);
        // create the gravatar url
        try {
            const user = yield models.User.create({
                name,
                email,
                password: hashed,
                profilePic: photoUrl.url,
                bio,
                dob,
            });
            // create and return the json web token
            return jwt.sign({ id: user._id, name: user.name, email: user.email }, "secret");
        }
        catch (err) {
            console.log(err);
            throw new Error("Error creating account");
        }
    }),
    login: (parent, { email, password }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        // try {
        if (email) {
            email = email.trim().toLowerCase();
        }
        const user = yield models.User.findOne({
            email,
        });
        // if there is no user, throw an authentication error
        if (!user) {
            throw new AuthenticationError("User doesn't exists");
        }
        // if the passwords don't match, throw an authentication error
        const valid = yield bcrypt.compare(password, user.password);
        if (!valid) {
            throw new AuthenticationError("Passwords do not match");
        }
        // create and return the json web token
        const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, "secret");
        return {
            token,
            user,
            message: "Successfully signed in",
        };
        // } catch (error) {
        //   console.log(error);
        //   throw new Error("Error logging in");
        // }
    }),
    updateUser: (_, { name, email, profilePic, dob, bio }, { models, user }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new AuthenticationError("You must login to update");
        }
        return yield models.User.findOneAndUpdate({
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
    }),
    likePost: (_, { id }, { models, user }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new AuthenticationError("You must login to like a post");
        }
        const post = yield models.Post.findById(id);
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
            yield post.save();
            return post;
        }
        else {
            throw new Error("Post not found");
        }
    }),
    createComment: (_, { postId, body }, { models, user }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new AuthenticationError("You must login to create a comment");
        }
        if (body.trim() === "") {
            throw new UserInputError("Comment body must not be empty", {
                errors: {
                    body: "Comment body must not be empty",
                },
            });
        }
        const post = yield models.Post.findById(postId);
        if (post) {
            post.comments.unshift({
                body,
                name: user.name,
                email: user.email,
                createdAt: new Date().toISOString(),
            });
            yield post.save();
            return post;
        }
        else
            throw new UserInputError("Post not found");
    }),
    deleteComment: (_, { postId, commentId }, { models, user }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new AuthenticationError("You must login to delete a comment");
        }
        const post = yield models.Post.findById(postId);
        if (post) {
            const commentIndex = post.comments.findIndex((c) => c.id === commentId);
            if (post.comments[commentIndex].email === user.email) {
                post.comments.splice(commentIndex, 1);
                yield post.save();
                return post;
            }
            else {
                throw new AuthenticationError("You can only delete your own comments");
            }
        }
        else {
            throw new UserInputError("Post not found");
        }
    }),
    friendRequest: (_, { id }, { models, user }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!user) {
                throw new AuthenticationError("You must login to send a friend request");
            }
            const userTo = yield models.User.findById(id);
            const userFrom = yield models.User.findById(user.id);
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
                yield userTo.save();
                return userTo;
            }
        }
        catch (error) {
            throw new Error("Error sending friend request");
        }
    }),
    acceptFriendRequest: (_, { email }, { models, user }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!user) {
                throw new AuthenticationError("You must login to accept a friend request");
            }
            const requestSender = yield models.User.findOne({ email });
            const requestReceiver = yield models.User.findById(user.id);
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
                yield models.User.updateOne({ _id: requestReceiver.id }, { $pull: { friendRequests: { email: email } } });
                // requestReceiver.friendRequests.pull({ email: email });
                yield requestReceiver.save();
                yield requestSender.save();
                return requestReceiver;
            }
            else {
                throw new UserInputError("Already Friends");
            }
        }
        catch (error) {
            throw new Error("Error accepting friend request");
        }
    }),
    declineFriendRequest: (_, { email }, { models, user }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!user) {
                throw new AuthenticationError("You must login to accept a friend request");
            }
            const me = yield models.User.findById(user.id);
            // const reqSender = await models.User.findOne({ email });
            yield models.User.updateOne({ _id: me.id }, { $pull: { friendRequests: { email: email } } });
            yield me.save();
        }
        catch (err) {
            throw new Error("Error declining friend request");
        }
    }),
    unFriend: (_, { email }, { models, user }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!user) {
                throw new AuthenticationError("You must login to accept a friend request");
            }
            const friend = yield models.User.findOne({ email });
            const currentUser = yield models.User.findById(user.id);
            if (currentUser.friends.find((f) => f.email === friend.email)) {
                yield models.User.updateOne({ _id: currentUser.id }, { $pull: { friends: { email: friend.email } } });
                yield models.User.updateOne({ _id: friend.id }, { $pull: { friends: { email: currentUser.email } } });
                yield friend.save();
                yield currentUser.save();
                return friend;
            }
            else {
                throw new UserInputError("Not in my friends List");
            }
        }
        catch (error) {
            throw new Error("Error in unfriending");
        }
    }),
    createConversation: (_, { sender, receiver }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        const conv = new models.Conversation({
            members: [{ sender, receiver }],
        });
        try {
            const saveConv = yield conv.save();
            return saveConv;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error in creating conversation");
        }
    }),
};
