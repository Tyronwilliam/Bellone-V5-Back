const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = require("graphql");

const Collaborator = require("./model"); // Importer le modèle Collaborator

// Définir le type Address
const AddressInput = new GraphQLInputObjectType({
  name: "AddressInput",
  fields: {
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    postalCode: { type: GraphQLString },
    country: { type: GraphQLString },
  },
});
const AddressType = new GraphQLObjectType({
  name: "AddressType",
  fields: {
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    postalCode: { type: GraphQLString },
    country: { type: GraphQLString },
  },
});

// Définir le type Role
const RoleType = new GraphQLObjectType({
  name: "Role",
  fields: {
    projectId: { type: GraphQLString },
    role: { type: new GraphQLList(GraphQLString) },
  },
});

// Définir le type RoleInput (pour les mutations)
const RoleInputType = new GraphQLInputObjectType({
  name: "RoleInput",
  fields: {
    projectId: { type: GraphQLString },
    role: { type: new GraphQLList(GraphQLString) },
  },
});

// Définir le type Collaborator
const CollaboratorType = new GraphQLObjectType({
  name: "Collaborator",
  fields: {
    id: { type: GraphQLString },
    projectId: { type: new GraphQLList(GraphQLString) },
    userId: { type: GraphQLString },
    roles: { type: new GraphQLList(RoleType) },
    creator: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    notes: { type: GraphQLString },
    address: { type: AddressType },
  },
});

// Query: Récupérer les collaborateurs par créateur ou par ID utilisateur
const RootQueryCollaborator = new GraphQLObjectType({
  name: "RootQueryCollaborator",
  fields: {
    collaboratorsByCreator: {
      type: new GraphQLList(CollaboratorType),
      args: { creator: { type: GraphQLString } },
      resolve: async (_, { creator }) => {
        if (!creator) {
          throw new Error("Creator ID is required");
        }
        try {
          const collaborators = await Collaborator.find({ creator });

          // Filter out invalid entries (e.g., missing email or invalid projectId)
          return collaborators.filter((collaborator) => {
            if (collaborator.email === null) {
              console.warn(
                `Skipping collaborator with ID: ${collaborator.id}, missing email`
              );
              return false;
            }
            return true;
          });
        } catch (error) {
          console.error("Error fetching collaborators:", error);
          throw new Error("Failed to fetch collaborators");
        }
      },
    },
    collaboratorsByProjectId: {
      type: new GraphQLList(CollaboratorType),
      args: { projectId: { type: new GraphQLList(GraphQLString) } },
      resolve: async (_, { projectId }) => {
        if (!projectId) {
          throw new Error("projectId ID is required");
        }
        return await Collaborator.find({ projectId });
      },
    },
    collaboratorByUserId: {
      type: CollaboratorType,
      args: { userId: { type: GraphQLString } },
      resolve: async (_, { userId }) => {
        if (!userId) {
          throw new Error("User ID is required");
        }
        return await Collaborator.findOne({ userId });
      },
    },
  },
});

// Mutation: Ajouter ou mettre à jour un collaborateur
const MutationCollaborator = new GraphQLObjectType({
  name: "MutationCollaborator",
  fields: {
    removeCollaborator: {
      type: CollaboratorType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (_, { id }) => {
        const collaborator = await Collaborator.findByIdAndDelete(id);
        if (!collaborator) {
          throw new Error("Collaborator not found");
        }
        return collaborator;
      },
    },
    addCollaborator: {
      type: CollaboratorType,
      args: {
        projectId: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        roles: { type: new GraphQLNonNull(new GraphQLList(RoleInputType)) },
        creator: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLString },
        notes: { type: GraphQLString },
        address: { type: AddressInput },
      },
      resolve: async (
        _,
        { projectId, userId, roles, creator, email, phone, notes, address }
      ) => {
        const newCollaborator = new Collaborator({
          projectId,
          userId,
          roles,
          creator,
          email,
          phone,
          notes,
          address,
        });
        return await newCollaborator.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryCollaborator,
  mutation: MutationCollaborator,
});
