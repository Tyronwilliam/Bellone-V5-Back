const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");
const Project = require("./model.js");

// Définir le type Project
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    clientId: { type: GraphQLInt },
    budget: { type: GraphQLFloat },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    status: { type: GraphQLString },
    progress: { type: GraphQLInt },
    creator: { type: GraphQLInt },
    time: { type: GraphQLInt },
    image: { type: GraphQLString },
    collaborators: {
      type: new GraphQLList(GraphQLString),
    },
  },
});

// Query : Récupérer les projets
const RootQueryProject = new GraphQLObjectType({
  name: "RootQueryProject",
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      args: {
        collaborator: { type: GraphQLString }, // Define creator argument
      },
      resolve: async (_, { collaborator }) => {
        if (!collaborator) {
          throw new Error("collaborator is required");
        }
        return await Project.find({ collaborators: collaborator }); // Find tasks where project_id matches
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, { id }) => {
        return await Project.findById(id);
      },
    },
  },
});
const fullArg = {
  id: { type: GraphQLID },
  title: { type: new GraphQLNonNull(GraphQLString) },
  description: { type: new GraphQLNonNull(GraphQLString) },
  clientId: { type: new GraphQLNonNull(GraphQLInt) },
  budget: { type: new GraphQLNonNull(GraphQLFloat) },
  startDate: { type: new GraphQLNonNull(GraphQLString) },
  endDate: { type: new GraphQLNonNull(GraphQLString) },
  status: { type: GraphQLString },
  progress: { type: GraphQLInt },
  creator: { type: new GraphQLNonNull(GraphQLInt) },
  image: { type: GraphQLString },
  collaborators: {
    type: new GraphQLList(GraphQLString),
  },
};
// Mutation : Ajouter ou modifier un projet
const MutationProject = new GraphQLObjectType({
  name: "MutationProject",
  fields: {
    createProject: {
      type: ProjectType,
      args: fullArg,
      resolve: async (_, args) => {
        const project = new Project(args);
        return await project.save();
      },
    },

    updateProject: {
      type: ProjectType,
      args: fullArg,
      resolve: async (_, { id, ...updates }) => {
        const project = await Project.findById(id);
        if (!project) throw new Error("Project not found");

        Object.keys(updates).forEach((key) => {
          if (updates[key] !== undefined) project[key] = updates[key];
        });

        return await project.save();
      },
    },
    patchProject: {
      type: ProjectType,
      args: fullArg,
      resolve: async (_, { id, ...updates }) => {
        const project = await Project.findById(id);
        if (!project) throw new Error("Project not found");

        // Met à jour uniquement les champs qui sont définis dans `updates`
        Object.keys(updates).forEach((key) => {
          if (updates[key] !== undefined) project[key] = updates[key];
        });

        return await project.save();
      },
    },
  },
});

// Exporter le schéma
module.exports = new GraphQLSchema({
  query: RootQueryProject,
  mutation: MutationProject,
});
