const mongoose = require("mongoose");

const CollaboratorSchema = new mongoose.Schema(
  {
    projectId: {
      type: [{ type: mongoose.Schema.Types.ObjectId }], // Correct référence à User avec ObjectId
      ref: "Project",
      required: true,
    },
    userId: {
      type: [{ type: mongoose.Schema.Types.ObjectId }], // Correct référence à User avec ObjectId
      ref: "User",
      required: true,
    },
    role: {
      roles: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Role" }, // Une liste de rôles associés à ce collaborateur
      ],
    }, // Par exemple, quel est le rôle du collaborateur
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Collaborator = mongoose.model("Collaborator", CollaboratorSchema);

module.exports = Collaborator;
