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
const Task = require("./model");

const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: {
    id: { type: GraphQLString }, // ID of the task
    project_id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    start_date: { type: GraphQLFloat },
    due_date: { type: GraphQLInt },
    time: { type: GraphQLInt },
    members: { type: new GraphQLList(GraphQLString) }, // List of members (user IDs)
    column_id: { type: GraphQLString }, // Column ID (could be string or number)
    pseudo_id: { type: GraphQLString }, // Expose pseudo_id in the GraphQL schema
    order: { type: GraphQLInt },
    createdAt: { type: GraphQLString }, // Add the createdAt field
    updatedAt: { type: GraphQLString }, // Add the updatedAt field
    completeAt: { type: GraphQLString },
  },
});

const fullArg = {
  id: { type: GraphQLString }, // ID of the task
  project_id: { type: GraphQLString },
  title: { type: GraphQLString },
  description: { type: GraphQLString },
  start_date: { type: GraphQLFloat },
  due_date: { type: GraphQLInt },
  time: { type: GraphQLInt },
  members: { type: new GraphQLList(GraphQLString) }, // Array of user IDs (strings)
  column_id: { type: GraphQLString }, // Column ID
  pseudo_id: { type: GraphQLString },
  order: { type: GraphQLInt },
};

const RootTaskQuery = new GraphQLObjectType({
  name: "RootTaskQuery",
  fields: {
    tasksByMember: {
      type: new GraphQLList(TaskType),
      args: { memberId: { type: GraphQLString } }, // Accept memberId as an argument
      resolve: async (_, { memberId }) => {
        // Find tasks where the members array includes the memberId
        return await Task.find({ members: memberId });
      },
    },
    tasksByProject: {
      type: new GraphQLList(TaskType),
      args: { project_id: { type: GraphQLString } }, // Accept project_id as an argument
      resolve: async (_, { project_id }) => {
        return await Task.find({ project_id }); // Find tasks where project_id matches
      },
    },
  },
});
const MutationTask = new GraphQLObjectType({
  name: "MutationTask",
  fields: {
    // Create a Task
    createTask: {
      type: TaskType,
      args: fullArg,
      resolve: async (_, args) => {
        // Create and save a new task
        const task = new Task(args); // Create new Task instance

        await task.save(); // Save to the database

        return await task.save(); // Save and return the newly created task
      },
    },

    // Update an existing Task (PATCH)
    updateTask: {
      type: TaskType,
      args: fullArg,
      resolve: async (_, { id, ...updates }) => {
        // Find the task by ID
        const task = await Task.findById(id);
        if (!task) throw new Error("Task not found");

        // Update the task with the provided fields (only those that are defined)
        Object.keys(updates).forEach((key) => {
          if (updates[key] !== undefined) {
            task[key] = updates[key];
          }
        });

        // Save and return the updated task
        return await task.save();
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootTaskQuery,
  mutation: MutationTask,
});
