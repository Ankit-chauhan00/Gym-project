import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SignInSchema } from "./lib/validation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { api } from "./lib/api";
import { ActionResponse } from "./types/action";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),

    CredentialsProvider({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (!validatedFields.success) throw new Error("Validation Error");

        const { email, password } = validatedFields.data!;

        //find user by email
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) throw new Error("Invalid email or Password");

        // oAuth-Account
        if (!user.password) {
          throw new Error(
            "This Account uses Google/github login. Please create a password first by using Forgot password"
          );
        }

        // compare password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) throw new Error("Invalid Email or Password");

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: user?.image,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const dbuser = await prisma.user.findUnique({
          where: {
            email: user.email?.trim().toLowerCase(),
          },
        });

        if (dbuser) {
          token.id = dbuser.id;
          token.role = dbuser.role;
        }
      }

      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github" ? (profile?.login as string) : (user.name?.toLocaleLowerCase() as string),
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      if (!success) return false;
      return true;
    },
  },
});
