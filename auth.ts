import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SignInSchema } from "./lib/validation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";



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

        // compare password
        const isValidPassword = await bcrypt.compare(password, user.password!);

        if (!isValidPassword) throw new Error("Invalid Email or Password");

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: user?.imageUrl,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async session({session, token}){
      if(session.user){
        session.user.id = token.id as string
        session.user.role = token.role as string;
      }
      return session;
    },

    async jwt({token , user}){

      if(user){
        token.id = user.id;
        token.role = user.role as string;
      }

      return token;
    }

  }
});
