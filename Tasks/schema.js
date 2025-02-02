const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInputObjectType,
} = require("graphql");
const Task = require("./model");
const MemberType = new GraphQLObjectType({
  name: "Member",
  fields: {
    id: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const MemberInputType = new GraphQLInputObjectType({
  name: "MemberInputType",
  fields: {
    id: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: {
    id: { type: GraphQLString },
    project_id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    content: { type: GraphQLString },
    start_date: { type: GraphQLFloat },
    due_date: { type: GraphQLFloat },
    time: { type: GraphQLInt },
    members: { type: new GraphQLList(MemberType) },
    column_id: { type: GraphQLString },
    pseudo_id: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    completeAt: { type: GraphQLString },
    order: { type: GraphQLInt },
  },
});

const fullArg = {
  id: { type: GraphQLString },
  project_id: { type: GraphQLString },
  title: { type: GraphQLString },
  description: { type: GraphQLString },
  content: { type: GraphQLString },
  start_date: { type: GraphQLFloat },
  due_date: { type: GraphQLFloat },
  time: { type: GraphQLInt },
  members: { type: new GraphQLList(MemberInputType) },
  column_id: { type: GraphQLString },
  pseudo_id: { type: GraphQLString },
  order: { type: GraphQLInt },
  completeAt: { type: GraphQLFloat },
};

const RootTaskQuery = new GraphQLObjectType({
  name: "RootTaskQuery",
  fields: {
    tasksByMember: {
      type: new GraphQLList(TaskType),
      args: { memberId: { type: GraphQLString } },
      resolve: async (_, { memberId }) => {
        return await Task.find({ members: memberId });
      },
    },
    tasksByProject: {
      type: new GraphQLList(TaskType),
      args: { project_id: { type: GraphQLString } },
      resolve: async (_, { project_id }) => {
        return await Task.find({ project_id });
      },
    },
  },
});
const MutationTask = new GraphQLObjectType({
  name: "MutationTask",
  fields: {
    createTask: {
      type: TaskType,
      args: fullArg,
      resolve: async (_, args) => {
        const task = new Task(args);
        return await task.save();
      },
    },

    updateTask: {
      type: TaskType,
      args: fullArg,
      resolve: async (_, { id, ...updates }) => {
        const task = await Task.findById(id);
        if (!task) throw new Error("Task not found");

        Object.keys(updates).forEach((key) => {
          if (updates[key] !== undefined) {
            task[key] = updates[key];
          }
        });

        return await task.save();
      },
    },
    deleteTask: {
      type: GraphQLString,
      args: { id: { type: GraphQLString } },
      resolve: async (_, { id }) => {
        try {
          const result = await Task.deleteOne({ _id: id });

          if (result.deletedCount === 1) {
            return "Task deleted successfully";
          } else {
            throw new Error("Task not found");
          }
        } catch (error) {
          console.error("Error deleting task:", error);
          throw new Error("Error deleting task");
        }
      },
    },
    deleteAllTasks: {
      type: GraphQLString,
      resolve: async () => {
        try {
          const result = await Task.deleteMany({});

          return result.deletedCount > 0
            ? "All tasks have been successfully deleted."
            : "No tasks found to delete.";
        } catch (error) {
          console.error(error);
          throw new Error("Error deleting tasks");
        }
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootTaskQuery,
  mutation: MutationTask,
});
