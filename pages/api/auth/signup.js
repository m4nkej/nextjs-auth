import { hashPassword } from "../../../lib/auth-util";
import { connectToDatabase, insertDocument } from "../../../lib/db-util";

async function handler(req, res) {
  const collectionName = "users";
  if (req.method === "POST") {
    const data = req.body;
    const { email, password } = data;
    const hashedPasswrod = await hashPassword(password);

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({ message: "Invalid input" });
      return;
    }

    let client;
    try {
      client = await connectToDatabase();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Connecting to DB failed!" });
      return;
    }

    try {
      const existingUser = findOneDocument(client, collectionName, {
        email: email,
      });
      if (existingUser) {
        res.status(422).json({ message: "User already exists!" });
        client.close();
        return;
      }
    } catch (error) {}

    try {
      const result = await insertDocument(client, collectionName, {
        email: email,
        password: hashedPasswrod,
      });
      res.status(201).json({ message: "User created." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error || "Unexpected error" });
    }

    client.close();
  }
}

export default handler;
