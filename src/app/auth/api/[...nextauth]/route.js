// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // optional simple callbacks - keep minimal for now
  callbacks: {
    async signIn({ user, account, profile }) {
      // allow sign in (you can put extra checks here)
      return true;
    },
    async session({ session, token, user }) {
      // attach anything you want to session here
      return session;
    },
  },
});

export { handler as GET, handler as POST };
