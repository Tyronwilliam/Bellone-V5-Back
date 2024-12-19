const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");

// Import the Role model
const Role = require("./models/Role"); // Adjust the path based on your project structure

// Define the RoleType (output type)
const RoleType = new GraphQLObjectType({
  name: "Role",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    permissions: { type: new GraphQLList(GraphQLString) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

// Define the RoleInput type (input type for mutations)
const RoleInputType = new GraphQLInputObjectType({
  name: "RoleInput",
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    permissions: { type: new GraphQLList(GraphQLString) },
  },
});

// Root Query for fetching roles
const RootQueryRole = new GraphQLObjectType({
  name: "RootQueryRole",
  fields: {
    roles: {
      type: new GraphQLList(RoleType),
      resolve: async () => {
        // Fetch all roles from the database
        return await Role.find();
      },
    },
    role: {
      type: RoleType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, { id }) => {
        // Fetch a single role by its ID
        return await Role.findById(id);
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
      args: {
        roleInput: { type: RoleInputType }, // Input object to create a new role
      },
      resolve: async (_, { roleInput }) => {
        const { name, description, permissions } = roleInput;
        const newRole = new Role({
          name,
          description,
          permissions,
        });
        return await newRole.save();
      },
    },

    updateRole: {
      type: RoleType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        roleInput: { type: RoleInputType }, // Input object to update an existing role
      },
      resolve: async (_, { id, roleInput }) => {
        const { name, description, permissions } = roleInput;
        const updatedRole = await Role.findByIdAndUpdate(
          id,
          { name, description, permissions },
          { new: true } // Return the updated role
        );
        return updatedRole;
      },
    },

    deleteRole: {
      type: RoleType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }, // ID of the role to delete
      },
      resolve: async (_, { id }) => {
        const deletedRole = await Role.findByIdAndDelete(id);
        return deletedRole;
      },
    },
  },
});

// Export the GraphQL schema
module.exports = new GraphQLSchema({
  query: RootQueryRole,
  mutation: MutationRole,
});
