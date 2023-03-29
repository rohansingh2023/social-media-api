import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import dotenv from "dotenv";
import dbConnect from "./db";
import typeDefs from "./graphql/typeDefs/schema";
import resolvers from "./graphql/resolvers/index";
import models from "./models";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

const port = process.env.PORT || 8000;

dbConnect();

app.use(express.json({ limit: "50mb" }));

let apolloServer: ApolloServer;

// get the user info from a JWT
const getUser = (token: any) => {
  if (token) {
    try {
      // return the user information from the token
      return jwt.verify(token, "secret");
    } catch (err) {
      // if there's a problem with the token, throw an error
      throw new Error("Session invalid");
    }
  }
};

async function startServer() {
  //Create an instance of Apollo Server
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // get the user token from the headers
      const token = req.headers.authorization;
      // try to retrieve a user with the token
      const user = getUser(token);
      // for now, let's log the user to the console:
      // console.log(user);
      // add the db models and the user to the context
      return { models, user };
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/api" });
}
startServer();

app.get("/rest", function (req, res) {
  res.json({ data: "api working" });
});

app.listen(port, function () {
  console.log(`server running on port ${port}`);
  // console.log(`gql path is ${apolloServer.graphqlPath}`);
});

// https://sm-graphql-api.onrender.com/
