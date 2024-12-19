const mongoose = require("mongoose");
const User = require("../User/model");
const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    clientId: { type: Number, required: true },
    budget: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "COMPLETED"],
      default: "OPEN",
    },
    progress: { type: Number, default: 0 },
    creator: { type: Number, required: true },
    time: { type: Number, default: 0 },
    image: { type: String, default: "" },
    collaborators: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Correct référence à User avec ObjectId
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
