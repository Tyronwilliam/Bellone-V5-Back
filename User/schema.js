const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
} = require("graphql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model"); // Importer le modèle d'utilisateur

// Définir un type utilisateur pour GraphQL
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

// Créer une mutation pour l'enregistrement
const MutationUser = new GraphQLObjectType({
  name: "MutationUser ",
  fields: {
    register: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { email, password }) => {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("User already exists");
        }

        // Hacher le mot de passe avant de sauvegarder l'utilisateur
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new User({
          email,
          password: hashedPassword,
        });

        return await newUser.save();
      },
    },

    login: {
      type: GraphQLString, // On retourne le JWT sous forme de string
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { email, password }) => {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }

        // Comparer le mot de passe
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        // Générer un JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        return token; // Retourner le token au client
      },
    },
  },
});

// Créer et exporter le schéma GraphQ
module.exports = new GraphQLSchema({
  mutation: MutationUser,
});
