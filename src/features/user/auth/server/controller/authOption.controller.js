// authOption.controller.js
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/connectDB.js";
import User from "../models/User.model";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@email.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          // Validate credentials exist
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          await connectDB();
          const { email, password } = credentials;

          // Find user by email (case-insensitive)
          const user = await User.findOne({
            email: email.toLowerCase(),
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          // Check if user is verified
          if (!user.isVerified) {
            throw new Error("Please verify your email before signing in");
          }

          // Check if user is active (optional field)
          if (user.isActive === false) {
            throw new Error("Your account has been deactivated");
          }

          // Verify password
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }

          // Update last login (optional)
          await User.findByIdAndUpdate(user._id, {
            lastLogin: new Date(),
          });

          // Return user object for JWT
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user", // Include role if available
            image: user.image || null, // Include profile image if available
          };
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          // Return null for failed authentication
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token._id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }

      // Return previous token if the access token has not expired yet
      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user._id = token._id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  // Security options
  secret: process.env.NEXTAUTH_SECRET,

  // Configure JWT
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export default authOptions;
