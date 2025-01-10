const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  project_id: { type: String, require: true },
  title: { type: String, require: true },
  description: { type: String, require: false },
  content: {
    type: Object,
  },
  start_date: { type: Number, require: false },
  due_date: { type: Number, require: false },
  time: { type: Number, require: false },
  members: [
    {
      id: { type: String, required: true }, // L'ID de l'utilisateur
      email: { type: String, required: true }, // L'email de l'utilisateur
    },
  ],
  column_id: {
    type: mongoose.Schema.Types.Mixed, // This allows either number or string types for column_id
    required: true, // Assuming column_id is required
  },
  order: { type: Number, require: true },
  pseudo_id: { type: String, required: false, unique: true }, // Add pseudo_id
});

TaskSchema.pre("save", function (next) {
  if (this.isNew) {
    this.pseudo_id = `item-${this._id}`; // Generate pseudo_id based on the MongoDB _id
  }
  next();
});

module.exports = mongoose.model("Task", TaskSchema);
