require("dotenv").config(); // Add this line at the top of server.js
var express = require("express");
var { createHandler } = require("graphql-http/lib/use/express");
var { buildSchema } = require("graphql");
const projectSchema = require("./Project/schema");
const userSchema = require("./User/schema");
const taskSchema = require("./Tasks/schema");
const columnSchema = require("./Kanban/columns/schema");
const kanbanSchema = require("./Kanban/kanban/schema");
const collaboratorsSchema = require("./Collaborators/schema");
var cors = require("cors");

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_CONNECT_STRING;
const authenticate = require("./middleware");

const PORT = process.env.PORT || 5000;

var app = express();
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Permet d'accepter les requêtes depuis ce domaine
//     methods: ["GET", "POST", "PATCH", "DELETE"], // Permet les méthodes GET, POST, PATCH, DELETE
//   })
// );

// The root provides a resolver function for each API endpoint
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Create and use the GraphQL handler.
// Route publique (non protégée par l'authentification)
app.use(
  "/bellone/public",
  createHandler({
    schema: userSchema, // Public user schema
    graphiql: true, // GraphiQL interface for testing queries
  })
);
app.use(
  "/bellone/protected/project",
  // authenticate, // Uncomment this line to require authentication
  createHandler({
    schema: projectSchema, // Project schema
    graphiql: true, // GraphiQL interface for testing queries
  })
);

app.use(
  "/bellone/protected/task",
  // authenticate, // Uncomment this line to require authentication
  createHandler({
    schema: taskSchema, // Task schema
    graphiql: true, // GraphiQL interface for testing queries
  })
);
app.use(
  "/bellone/protected/columns",
  // authenticate, // Uncomment this line to require authentication
  createHandler({
    schema: columnSchema, // Task schema
    graphiql: true, // GraphiQL interface for testing queries
  })
);
app.use(
  "/bellone/protected/kanban",
  // authenticate, // Uncomment this line to require authentication
  createHandler({
    schema: kanbanSchema, // Kanban schema
    graphiql: true, // GraphiQL interface for testing queries
  })
);
app.use(
  "/bellone/protected/collaborators",
  // authenticate, // Uncomment this line to require authentication
  createHandler({
    schema: collaboratorsSchema, // Kanban schema
    graphiql: true, // GraphiQL interface for testing queries
  })
);

// Start the server at port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
