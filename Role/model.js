const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Le nom du rôle (par exemple : "admin", "member", "viewer")
    description: { type: String, required: false }, // Optionnel, description du rôle
    permissions: [{ type: String }], // Une liste de permissions associées au rôle (par exemple : "create_project", "view_project")
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;
