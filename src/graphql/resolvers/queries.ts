import { AuthenticationError } from "apollo-server-express";
import { model } from "mongoose";
import models from "../../models";
import User from "../../models/User";

export default {
  hello: () => "Hello world!",

  currentUser: async (parent: any, args: any, { models, user }: any) => {
    if (!user) {
      throw new AuthenticationError("You must login to get your user");
    }
    const userData = await models.User.findById(user.id);
    return {
      user: userData,
      posts: await models.Post.find({ user: userData.id }),
    };
  },

  userById: async (parent: any, { id }: any, { models }: any) => {
    const userData = await models.User.findById(id);
    return {
      user: userData,
      posts: await models.Post.find({ user: userData.id }),
    };
  },

  users: async (parent: any, args: any, { models }: any) => {
    const users = await models.User.find();
    return users.map(async (user: { id: any; posts: any }) => ({
      user,
      posts: await models.Post.find({ user: user.id }),
    }));
  },
  onlyUsersExcludingMe: async (_: any, args: any, { models, user }: any) => {
    const users = (await models.User.find()).filter(
      (f: any) => f.id !== user.id
    );
    return users;
  },
  usersExcludingMe: async (parent: any, args: any, { models, user }: any) => {
    const users = (await models.User.find()).filter(
      (f: any) => f.id !== user.id
    );
    return users.map(async (user: { id: any; posts: any }) => ({
      user,
      posts: await models.Post.find({ user: user.id }),
    }));
  },

  onlyUsers: async (parent: any, args: any, { models }: any) => {
    const users = await models.User.find();
    return users;
  },

  posts: async () => {
    try {
      const posts = await models.Post.find().sort({ createdAt: -1 });
      return posts.map(async (post) => {
        return {
          posts: post,
          user: await models.User.findById(post.user),
        };
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error getting posts");
    }
  },

  postById: async (parent: any, args: any, { models }: any) => {
    try {
      const post = await models.Post.findById(args.id);
      return {
        posts: post,
        user: await models.User.findById(post.user),
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error getting post");
    }
  },

  postByUserId: async (parent: any, args: any, { models }: any) => {
    try {
      const posts = await models.Post.find({ user: args.id }).sort({
        createdAt: -1,
      });
      return posts.map(async (post: any) => {
        return {
          posts: post,
          user: await models.User.findById(post.user),
        };
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error getting posts");
    }
  },

  searchUsers: async (parent: any, args: any, { models }: any) => {
    try {
      const regex = new RegExp(args.searchTerm, "i");
      const users = await models.User.find({
        $or: [{ name: regex }, { email: regex }],
      }).sort({ createdAt: -1 });
      return {
        users,
        totalCount: users.length,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error getting users");
    }
  },
  friendRequests: async (_: any, args: any, { models }: any) => {
    try {
      const userDet = await models.User.findById(args.id);
      // if (userDet.friendRequests.length > 0) {
      return userDet.map((f: any) => ({
        id: f.id,
        name: f.name,
        email: f.email,
        createdAt: f.createdAt,
        profilePic: f.profilePic,
      }));
      // } else {
      //   return "No friend Requests";
      // }
    } catch (error) {
      console.log(error);
      throw new Error("Error getting users");
    }
  },
  friends: async (_: any, args: any, { models }: any) => {
    try {
      const userDet = await models.User.findById(args.id);
      return userDet.friends.map((f: any) => ({
        id: f.id,
        name: f.name,
        email: f.email,
        createdAt: f.createdAt,
        profilePic: f.profilePic,
      }));
    } catch (error) {
      console.log(error);
      throw new Error("Error getting users");
    }
  },
  onlyMyFriendsPost: async (_: any, { id }: any, { models, user }: any) => {
    try {
      if (!user) {
        throw new AuthenticationError(
          "You must login to send a friend request"
        );
      }
      const me = await models.User.findById(id);
      const posts2 = await models.Post.find();
      me?.friends?.map(async (f: any) => {
        return {
          posts: posts2.filter((p: any) => p.user === f.userId),
          user: await models.User.findById(f.userId),
        };
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error getting posts");
    }
  },
  getConversations: async (_: any, { id }: any, { models }: any) => {
    try {
      const conversation = await models.Conversation.find({
        $in: id,
      });
      return conversation;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting conversations");
    }
  },
};
