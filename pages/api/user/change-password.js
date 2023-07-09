import { getServerSession } from "next-auth";
import {
  connectToDatabase,
  findOneDocument,
  updateOneDocument,
} from "../../../lib/db-util";
import { comparePasswords, hashPassword } from "../../../lib/auth-util";
import { authOptions } from "../auth/[...nextauth]";

async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.status(404).json({ message: "Method not suppported" });
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const userEmail = session.user.email;
  //todo: add validation
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const client = await connectToDatabase();
  const user = await findOneDocument(client, "users", {
    email: userEmail,
  });

  if (!user) {
    client.close();
    res.status(404).json({ message: "User not found" });
    return;
  }

  const currentPassword = user.password;
  const passwordsAreEqual = await comparePasswords(
    oldPassword,
    currentPassword
  );

  if (!passwordsAreEqual) {
    client.close();
    res.status(403).json({ message: "Invalid old password" });
    return;
  }

  const hashedPassword = await hashPassword(newPassword);
  const result = await updateOneDocument(
    client,
    "users",
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );
  client.close();
  res.status(200).json({ message: "Password updated" });
}

export default handler;
