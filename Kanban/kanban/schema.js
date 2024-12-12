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
const Kanban = require("./model");

// Define the KanbanType for GraphQL
const KanbanType = new GraphQLObjectType({
  name: "Kanban",
  fields: {
    id: { type: GraphQLID }, // The unique identifier for the Kanban
    project_id: { type: new GraphQLNonNull(GraphQLInt) }, // The project ID to which the Kanban belongs
    image: { type: new GraphQLNonNull(GraphQLString) }, // The image URL for the Kanban
    assigned_to: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLInt)), // The IDs of the users assigned to the Kanban (array of integers)
    },
  },
});

// Root query for Kanban
const KanbanQuery = new GraphQLObjectType({
  name: "KanbanQuery",
  fields: {
    kanbansByProjectId: {
      type: new GraphQLList(KanbanType),
      args: { project_id: { type: GraphQLInt } }, // Accept memberId as an argument
      resolve: async (_, { project_id }, context) => {
        // const userId = context.userId; // Suppose que vous extrayez userId du token dans le contexte de la requête

        // if (!userId) {
        //   throw new Error("Unauthorized access"); // L'utilisateur n'est pas connecté
        // }

        // // Vérifiez si le projet appartient à l'utilisateur ou si l'utilisateur y a accès
        // const project = await Project.findOne({
        //   _id: project_id,
        //   users: userId,
        // });
        // if (!project) {
        //   throw new Error("You do not have access to this project");
        // }

        // // Si l'utilisateur a accès, récupérer les kanbans pour ce projet
        // return await Kanban.find({ project_id });
        // Find tasks where the members array includes the memberId
        return await Kanban.find({ project_id });
      },
    },
    kanbanById: {
      type: KanbanType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, { id }) => {
        return await Kanban.findById(id); // Fetch a single Kanban by its ID
      },
    },
  },
});

// Mutation for Kanban
const KanbanMutation = new GraphQLObjectType({
  name: "KanbanMutation",
  fields: {
    // Create a new Kanban
    createKanban: {
      type: KanbanType,
      args: {
        project_id: { type: new GraphQLNonNull(GraphQLInt) },
        image: { type: new GraphQLNonNull(GraphQLString) },
        assigned_to: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, { project_id, image, assigned_to }) => {
        const kanban = new Kanban({ project_id, image, assigned_to });
        return await kanban.save(); // Save and return the newly created Kanban
      },
    },
    // Update an existing Kanban
    updateKanban: {
      type: KanbanType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        project_id: { type: GraphQLInt },
        image: { type: GraphQLString },
        assigned_to: { type: GraphQLInt },
      },
      resolve: async (_, { id, project_id, image, assigned_to }) => {
        const kanban = await Kanban.findById(id);
        if (!kanban) throw new Error("Kanban not found");

        // Update the fields that were provided
        if (project_id !== undefined) kanban.project_id = project_id;
        if (image !== undefined) kanban.image = image;
        if (assigned_to !== undefined) kanban.assigned_to = assigned_to;

        return await kanban.save(); // Save and return the updated Kanban
      },
    },
    // Delete an existing Kanban
    deleteKanban: {
      type: KanbanType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { id }) => {
        const kanban = await Kanban.findById(id);
        if (!kanban) throw new Error("Kanban not found");

        await kanban.remove(); // Remove the Kanban
        return kanban; // Return the deleted Kanban
      },
    },
  },
});

// Create and export the GraphQL schema
module.exports = new GraphQLSchema({
  query: KanbanQuery,
  mutation: KanbanMutation,
});
