const mongoose = require("mongoose");
const User = require("../User/model"); // Importer le modèle User
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // Utilisé pour générer un mot de passe aléatoire
// Schéma pour les rôles
const RoleSchema = new mongoose.Schema(
  {
    projectId: {
      type: String, // Référence au modèle Project
      ref: "Project",
      required: true,
    },
    role: {
      type: [String], // Référence au modèle Role
      ref: "Role",
      required: true,
    },
  },
  { _id: false } // Nous n'avons pas besoin de l'_id pour cet objet imbriqué
);

// Schéma principal pour le Collaborator
const CollaboratorSchema = new mongoose.Schema(
  {
    projectId: {
      type: String, // Tableau de références aux projets
      ref: "Project",
      required: true,
    },
    userId: {
      type: String,
      ref: "User",
      // required: true,
    },
    roles: {
      type: [RoleSchema], // Tableau de rôles avec chaque rôle ayant un projectId et un rôle spécifique
      required: true,
    },
    creator: {
      type: String, // Référence à l'utilisateur créateur
      ref: "User",
      required: true,
    },
    email: { type: String, required: true }, // Quand email recu chercher user avec cette email et attribuer userId à l'email si pas d'User creer un compte provisoir ??? Chatgpt aide moi
    phone: { type: String },
    notes: { type: String },
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
  },
  { timestamps: true }
);

CollaboratorSchema.methods.assignUserByEmail = async function (email) {
  let user = await User.findOne({ email });

  // Si l'utilisateur n'existe pas, créer un utilisateur provisoire
  if (!user) {
    // Générer un mot de passe aléatoire (par exemple, un mot de passe de 12 caractères)
    const randomPassword = crypto.randomBytes(6).toString("hex"); // Un mot de passe de 12 caractères hexadécimaux

    // Crypter le mot de passe avec bcrypt
    const hashedPassword = await bcrypt.hash(randomPassword, 10); // 10 est le "salt rounds"

    // Créer un utilisateur provisoire avec un mot de passe aléatoire
    user = new User({
      email,
      isTemporary: true, // Utilisateur provisoire
      password: hashedPassword, // Sauvegarder le mot de passe crypté
    });

    await user.save(); // Sauvegarde de l'utilisateur
    console.log("Temporary password:", randomPassword); // Afficher le mot de passe temporaire (ou le garder pour vous)
  }

  // Assigner l'ID de l'utilisateur au collaborateur
  this.userId = user._id;
};
CollaboratorSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Assigner un utilisateur en fonction de l'email
    await this.assignUserByEmail(this.email); // Appel de la méthode assignUserByEmail pour assigner l'utilisateur
  }
  next(); // Continuer la sauvegarde
});
// Création du modèle Collaborator basé sur le schéma
const Collaborator = mongoose.model("Collaborator", CollaboratorSchema);

module.exports = Collaborator;
