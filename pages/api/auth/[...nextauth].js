import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase, findOneDocument } from "../../../lib/db-util";
import { comparePasswords } from "../../../lib/auth-util";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectToDatabase();
        const user = await findOneDocument(client, "users", {
          email: credentials.email,
        });
        if (!user) {
          client.close();
          throw new Error("No user find!");
        }

        const isValid = await comparePasswords(
          credentials.password,
          user.password
        );
        if (!isValid) {
          client.close();
          throw new Error("Password inccorect");
        }

        client.close();
        return { email: user.email }; //jwt + additional data
      },
    }),
  ],
});
