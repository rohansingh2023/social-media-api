import { gql } from "apollo-server-express";
const typeDefs = gql `
  scalar Date
  type Post {
    id: ID!
    user: ID!
    content: String!
    image: String!
    likes: [like]!
    comments: [comment]!
    createdAt: Date
    updatedAt: String
    # user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    profilePic: String!
    dob: String!
    bio: String!
    friendRequests: [FriendRequest]!
    friends: [Friend]!
    # posts: [Post]
  }

  type Conversation {
    id: ID!
    members: [member]!
    createdAt: String!
  }

  type member {
    sender: String!
    receiver: String!
  }

  type AuthData {
    token: String
    user: User
    message: String
  }

  type AllPostData {
    posts: Post
    user: User
  }

  type UserData {
    user: User
    posts: [Post]
  }

  type like {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
  }

  type comment {
    id: ID!
    name: String!
    email: String!
    body: String!
    createdAt: String!
  }

  type SearchUsers {
    users: [User]!
    totalCount: Int!
  }

  type FriendRequest {
    id: ID!
    userId: ID!
    name: String!
    email: String!
    createdAt: String!
    profilePic: String!
  }

  type Friend {
    id: ID!
    userId: ID!
    name: String!
    email: String!
    createdAt: String!
    profilePic: String!
  }

  type Query {
    hello: String
    posts: [AllPostData]!
    postById(id: ID!): AllPostData!
    currentUser: UserData!
    userById(id: ID!): UserData!
    users: [UserData]!
    postByUserId(id: ID!): [AllPostData!]!
    onlyUsers: [User!]!
    searchUsers(searchTerm: String!): SearchUsers!
    friendRequests(id: ID!): [FriendRequest]!
    friends(id: ID!): [Friend]!
    onlyUsersExcludingMe: [User!]!
    usersExcludingMe: [UserData!]!
    onlyMyFriendsPost(id: ID!): [AllPostData]
    getConversations(id: ID!): [Conversation]!
  }

  type Mutation {
    addPost(content: String!, image: String!): Post!
    updatePost(id: ID!, content: String, image: String): Post!
    deletePost(id: ID!): Boolean!
    register(
      name: String!
      email: String!
      password: String!
      profilePic: String!
      dob: String!
      bio: String!
    ): AuthData!
    login(email: String!, password: String!): AuthData!
    likePost(id: ID!): Post!
    updateUser(
      name: String!
      email: String!
      profilePic: String!
      dob: String!
      bio: String!
    ): User!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    friendRequest(id: ID!): User!
    acceptFriendRequest(email: String!): User!
    declineFriendRequest(email: String!): User
    unFriend(email: String!): User!
    createConversation(sender: String!, receiver: String!): Conversation!
  }
`;
export default typeDefs;
