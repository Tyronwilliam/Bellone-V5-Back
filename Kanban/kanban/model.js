const mongoose = require("mongoose");

// Define the Schema
const KanbanSchema = new mongoose.Schema(
  {
    project_id: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    assigned_to: {
      type: [Number], // Tableau d'IDs d'utilisateurs
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

// Create the model
module.exports = mongoose.model("Kanban", KanbanSchema);
