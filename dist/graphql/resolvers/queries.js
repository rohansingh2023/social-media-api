var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AuthenticationError } from "apollo-server-express";
import models from "../../models/index.js";
export default {
    hello: () => "Hello world!",
    currentUser: (parent, args, { models, user }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new AuthenticationError("You must login to get your user");
        }
        const userData = yield models.User.findById(user.id);
        return {
            user: userData,
            posts: yield models.Post.find({ user: userData.id }),
        };
    }),
    userById: (parent, { id }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        const userData = yield models.User.findById(id);
        return {
            user: userData,
            posts: yield models.Post.find({ user: userData.id }),
        };
    }),
    users: (parent, args, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield models.User.find();
        return users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                user,
                posts: yield models.Post.find({ user: user.id }),
            });
        }));
    }),
    onlyUsersExcludingMe: (_, args, { models, user }) => __awaiter(void 0, void 0, void 0, function* () {
        const users = (yield models.User.find()).filter((f) => f.id !== user.id);
        return users;
    }),
    usersExcludingMe: (parent, args, { models, user }) => __awaiter(void 0, void 0, void 0, function* () {
        const users = (yield models.User.find()).filter((f) => f.id !== user.id);
        return users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                user,
                posts: yield models.Post.find({ user: user.id }),
            });
        }));
    }),
    onlyUsers: (parent, args, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield models.User.find();
        return users;
    }),
    posts: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const posts = yield models.Post.find().sort({ createdAt: -1 });
            return posts.map((post) => __awaiter(void 0, void 0, void 0, function* () {
                return {
                    posts: post,
                    user: yield models.User.findById(post.user),
                };
            }));
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting posts");
        }
    }),
    postById: (parent, args, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const post = yield models.Post.findById(args.id);
            return {
                posts: post,
                user: yield models.User.findById(post.user),
            };
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting post");
        }
    }),
    postByUserId: (parent, args, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const posts = yield models.Post.find({ user: args.id }).sort({
                createdAt: -1,
            });
            return posts.map((post) => __awaiter(void 0, void 0, void 0, function* () {
                return {
                    posts: post,
                    user: yield models.User.findById(post.user),
                };
            }));
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting posts");
        }
    }),
    searchUsers: (parent, args, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const regex = new RegExp(args.searchTerm, "i");
            const users = yield models.User.find({
                $or: [{ name: regex }, { email: regex }],
            }).sort({ createdAt: -1 });
            return {
                users,
                totalCount: users.length,
            };
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting users");
        }
    }),
    friendRequests: (_, args, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userDet = yield models.User.findById(args.id);
            // if (userDet.friendRequests.length > 0) {
            return userDet.map((f) => ({
                id: f.id,
                name: f.name,
                email: f.email,
                createdAt: f.createdAt,
                profilePic: f.profilePic,
            }));
            // } else {
            //   return "No friend Requests";
            // }
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting users");
        }
    }),
    friends: (_, args, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userDet = yield models.User.findById(args.id);
            return userDet.friends.map((f) => ({
                id: f.id,
                name: f.name,
                email: f.email,
                createdAt: f.createdAt,
                profilePic: f.profilePic,
            }));
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting users");
        }
    }),
    onlyMyFriendsPost: (_, { id }, { models, user }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            if (!user) {
                throw new AuthenticationError("You must login to send a friend request");
            }
            const me = yield models.User.findById(id);
            const posts2 = yield models.Post.find();
            (_a = me === null || me === void 0 ? void 0 : me.friends) === null || _a === void 0 ? void 0 : _a.map((f) => __awaiter(void 0, void 0, void 0, function* () {
                return {
                    posts: posts2.filter((p) => p.user === f.userId),
                    user: yield models.User.findById(f.userId),
                };
            }));
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting posts");
        }
    }),
    getConversations: (_, { id }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const conversation = yield models.Conversation.find({
                $in: id,
            });
            return conversation;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting conversations");
        }
    }),
};
