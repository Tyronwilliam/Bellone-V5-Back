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
const Column = require("./model");

const ColumnType = new GraphQLObjectType({
  name: "Column",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) }, // L'ID est obligatoire pour identifier la colonne
    title: { type: new GraphQLNonNull(GraphQLString) },
    color: { type: GraphQLString },
    project_id: { type: new GraphQLNonNull(GraphQLString) },
    order: { type: new GraphQLNonNull(GraphQLInt) },
    pseudo_id: { type: new GraphQLNonNull(GraphQLString) },
  },
});
// Root Query for Columns
const ColumnQuery = new GraphQLObjectType({
  name: "ColumnQuery",
  fields: {
    columns: {
      type: ColumnType,
      args: { id: { type: GraphQLString } }, // Accepts column ID as an argument
      resolve: async (_, { id }) => {
        return await Column.findById(id); // Fetch a column by its ID
      },
    },
    // Query to get all columns by project_id
    columnsByProjectId: {
      type: new GraphQLList(ColumnType),
      args: { project_id: { type: GraphQLString } }, // Accepts project_id as an argument
      resolve: async (_, { project_id }) => {
        return await Column.find({ project_id }); // Fetch columns by project_id
      },
    },
  },
});

const fullArg = {
  id: { type: GraphQLString },
  title: { type: GraphQLString },
  color: { type: GraphQLString },
  project_id: { type: GraphQLString },
  order: { type: GraphQLInt },
  pseudo_id: { type: GraphQLString },
};
// Mutations for Columns
const ColumnMutation = new GraphQLObjectType({
  name: "ColumnMutation",
  fields: {
    // Mutation to create a new column
    addColumn: {
      type: ColumnType,
      args: fullArg,
      resolve: async (_, { title, color, project_id, order }) => {
        // Create a new column using Mongoose
        const column = new Column({
          title,
          color,
          project_id,
          order,
        });
        await column.save(); // Save the column to MongoDB
        return column;
      },
    },
    // Mutation to update an existing column
    updateColumn: {
      type: ColumnType,
      args: fullArg,
      resolve: async (_, { id, title, color, project_id, order }) => {
        // Update the column in MongoDB
        const column = await Column.findById(id);
        if (!column) {
          throw new Error("Column not found");
        }

        if (title) column.title = title;
        if (color) column.color = color;
        if (project_id) column.project_id = project_id;
        if (order !== undefined) column.order = order;

        await column.save(); // Save the updated column to MongoDB
        return column;
      },
    },
  },
});
// Exporter le schéma
module.exports = new GraphQLSchema({
  query: ColumnQuery,
  mutation: ColumnMutation,
});
