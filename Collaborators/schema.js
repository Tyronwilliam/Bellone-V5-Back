const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");

const Collaborator = require("./model"); // Import the Collaborator model

const CollaboratorType = new GraphQLObjectType({
  name: "Collaborator",
  fields: {
    id: { type: GraphQLID },
    projectId: { type: new GraphQLList(GraphQLID) },
    userId: { type: GraphQLID },
    role: {
      type: new GraphQLObjectType({
        name: "Role",
        fields: {
          roles: { type: new GraphQLList(GraphQLID) }, // List of role IDs
        },
      }),
    },
    joinedAt: { type: GraphQLString },
  },
});

// Query: Retrieve collaborators for a specific project
const RootQueryCollaborator = new GraphQLObjectType({
  name: "RootQueryCollaborator",
  fields: {
    collaborators: {
      type: new GraphQLList(CollaboratorType),
      args: { projectId: { type: GraphQLID } },
      resolve: async (_, { projectId }) => {
        if (!projectId) {
          throw new Error("Project ID is required");
        }
        return await Collaborator.find({ projectId });
      },
    },
    collaborator: {
      type: CollaboratorType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, { id }) => {
        return await Collaborator.findById(id);
      },
    },
  },
});

// Mutation: Add or update a collaborator
const MutationCollaborator = new GraphQLObjectType({
  name: "MutationCollaborator",
  fields: {
    removeCollaborator: {
      type: CollaboratorType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        const collaborator = await Collaborator.findByIdAndDelete(id);
        if (!collaborator) {
          throw new Error("Collaborator not found");
        }
        return collaborator;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryCollaborator,
  mutation: MutationCollaborator,
});
