const mongoose = require("mongoose");

const ColumnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  color: { type: String, required: false },
  project_id: { type: mongoose.Schema.Types.Mixed, required: true }, // Can be either a number or string
  order: { type: Number, required: true }, // Field to control the column order
  pseudo_id: { type: String, required: false, unique: true }, // Pseudo ID for the column
});

// Middleware to generate pseudo_id before saving
ColumnSchema.pre("save", function (next) {
  if (this.isNew) {
    // Generate pseudo_id based on the MongoDB _id
    this.pseudo_id = `container-${this._id}`; // "container-" followed by the generated _id
  }
  next();
});

module.exports = mongoose.model("Column", ColumnSchema);
