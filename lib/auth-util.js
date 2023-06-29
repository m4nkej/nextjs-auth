import { hash } from "bcryptjs";

export async function hashPassword(password) {
  const hashedPasswrod = await hash(password, 12);
  return hashedPasswrod;
}
