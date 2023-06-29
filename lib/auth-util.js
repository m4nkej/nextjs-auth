import { hash, compare } from "bcryptjs";

export async function hashPassword(password) {
  const hashedPasswrod = await hash(password, 12);
  return hashedPasswrod;
}

export async function comparePasswords(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
