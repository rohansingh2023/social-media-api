"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const models_1 = __importDefault(require("../../models"));
exports.default = {
    hello: () => "Hello world!",
    currentUser: async (parent, args, { models, user }) => {
        if (!user) {
            throw new apollo_server_express_1.AuthenticationError("You must login to get your user");
        }
        const userData = await models.User.findById(user.id);
        return {
            user: userData,
            posts: await models.Post.find({ user: userData.id }),
        };
    },
    userById: async (parent, { id }, { models }) => {
        const userData = await models.User.findById(id);
        return {
            user: userData,
            posts: await models.Post.find({ user: userData.id }),
        };
    },
    users: async (parent, args, { models }) => {
        const users = await models.User.find();
        return users.map(async (user) => ({
            user,
            posts: await models.Post.find({ user: user.id }),
        }));
    },
    onlyUsersExcludingMe: async (_, args, { models, user }) => {
        const users = (await models.User.find()).filter((f) => f.id !== user.id);
        return users;
    },
    usersExcludingMe: async (parent, args, { models, user }) => {
        const users = (await models.User.find()).filter((f) => f.id !== user.id);
        return users.map(async (user) => ({
            user,
            posts: await models.Post.find({ user: user.id }),
        }));
    },
    onlyUsers: async (parent, args, { models }) => {
        const users = await models.User.find();
        return users;
    },
    posts: async () => {
        try {
            const posts = await models_1.default.Post.find().sort({ createdAt: -1 });
            return posts.map(async (post) => {
                return {
                    posts: post,
                    user: await models_1.default.User.findById(post.user),
                };
            });
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting posts");
        }
    },
    postById: async (parent, args, { models }) => {
        try {
            const post = await models.Post.findById(args.id);
            return {
                posts: post,
                user: await models.User.findById(post.user),
            };
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting post");
        }
    },
    postByUserId: async (parent, args, { models }) => {
        try {
            const posts = await models.Post.find({ user: args.id }).sort({
                createdAt: -1,
            });
            return posts.map(async (post) => {
                return {
                    posts: post,
                    user: await models.User.findById(post.user),
                };
            });
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting posts");
        }
    },
    searchUsers: async (parent, args, { models }) => {
        try {
            const regex = new RegExp(args.searchTerm, "i");
            const users = await models.User.find({
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
    },
    friendRequests: async (_, args, { models }) => {
        try {
            const userDet = await models.User.findById(args.id);
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
    },
    friends: async (_, args, { models }) => {
        try {
            const userDet = await models.User.findById(args.id);
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
    },
    onlyMyFriendsPost: async (_, { id }, { models, user }) => {
        try {
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError("You must login to send a friend request");
            }
            const me = await models.User.findById(id);
            const posts2 = await models.Post.find();
            me?.friends?.map(async (f) => {
                return {
                    posts: posts2.filter((p) => p.user === f.userId),
                    user: await models.User.findById(f.userId),
                };
            });
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting posts");
        }
    },
    getConversations: async (_, { id }, { models }) => {
        try {
            const conversation = await models.Conversation.find({
                $in: id,
            });
            return conversation;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting conversations");
        }
    },
};
//# sourceMappingURL=queries.js.map