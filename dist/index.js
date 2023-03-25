var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import express from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import dbConnect from "./db.js";
import typeDefs from "./graphql/typeDefs/schema.js";
import resolvers from "./graphql/resolvers/index.js";
import models from "./models/index.js";
import jwt from "jsonwebtoken";
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
dbConnect();
app.use(express.json({ limit: "50mb" }));
let apolloServer;
// get the user info from a JWT
const getUser = (token) => {
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
function startServer() {
  return __awaiter(this, void 0, void 0, function* () {
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
    yield apolloServer.start();
    apolloServer.applyMiddleware({ app, path: "/api" });
  });
}
startServer();
app.get("/rest", function (req, res) {
  res.json({ data: "api working" });
});
app.listen(port, function () {
  console.log(`server running on port ${port}`);
  // console.log(`gql path is ${apolloServer.graphqlPath}`);
});
