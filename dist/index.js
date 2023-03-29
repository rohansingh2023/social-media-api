"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const schema_1 = __importDefault(require("./graphql/typeDefs/schema"));
const index_1 = __importDefault(require("./graphql/resolvers/index"));
const models_1 = __importDefault(require("./models"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
(0, db_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
let apolloServer;
// get the user info from a JWT
const getUser = (token) => {
    if (token) {
        try {
            // return the user information from the token
            return jsonwebtoken_1.default.verify(token, "secret");
        }
        catch (err) {
            // if there's a problem with the token, throw an error
            throw new Error("Session invalid");
        }
    }
};
async function startServer() {
    //Create an instance of Apollo Server
    apolloServer = new apollo_server_express_1.ApolloServer({
        typeDefs: schema_1.default,
        resolvers: index_1.default,
        context: ({ req }) => {
            // get the user token from the headers
            const token = req.headers.authorization;
            // try to retrieve a user with the token
            const user = getUser(token);
            // for now, let's log the user to the console:
            // console.log(user);
            // add the db models and the user to the context
            return { models: models_1.default, user };
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
//# sourceMappingURL=index.js.map