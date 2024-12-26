const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");

// Import the Role model
const Role = require("./model"); // Adjust the path based on your project structure

// Define the RoleType
const RoleType = new GraphQLObjectType({
  name: "Role",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    permissions: { type: new GraphQLList(GraphQLString) },
  },
});

// Argument definitions for Role operations
const roleArgs = {
  name: { type: new GraphQLNonNull(GraphQLString) },
  description: { type: GraphQLString },
  permissions: { type: new GraphQLList(GraphQLString) },
};

// Root Query for fetching roles
const RootQueryRole = new GraphQLObjectType({
  name: "RootQueryRole",
  fields: {
    roles: {
      type: new GraphQLList(RoleType),
      resolve: async () => {
        return await Role.find(); // Fetch all roles from the database
      },
    },
    roleById: {
      type: RoleType,
      args: { id: { type: GraphQLString } },
      resolve: async (_, { id }) => {
        return await Role.findById(id); // Fetch a single role by its ID
      },
    },
  },
});

// Mutations for creating, updating, and deleting roles
const MutationRole = new GraphQLObjectType({
  name: "MutationRole",
  fields: {
    createRole: {
      type: RoleType,
      args: roleArgs,
      resolve: async (_, { name, description, permissions }) => {
        const newRole = new Role({ name, description, permissions });
        return await newRole.save();
      },
    },

    updateRole: {
      type: RoleType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        ...roleArgs,
      },
      resolve: async (_, { id, name, description, permissions }) => {
        if (!id) throw new Error("Update Role failed, Id is missing");

        return await Role.findByIdAndUpdate(
          id,
          { name, description, permissions },
          { new: true } // Return the updated role
        );
      },
    },

    deleteRole: {
      type: RoleType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { id }) => {
        if (!id) throw new Error("Delete Role failed, Id is missing");

        return await Role.findByIdAndDelete(id); // Delete the role by ID
      },
    },
  },
});

// Export the GraphQL schema
module.exports = new GraphQLSchema({
  query: RootQueryRole,
  mutation: MutationRole,
});
