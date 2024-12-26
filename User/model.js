const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Modèle utilisateur
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isTemporary: { type: Boolean, default: false }, // Champ pour les utilisateurs provisoires
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
