import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, password, firstName, lastName } = await req.json();

  if (!email || !password || !firstName || !lastName) {
    return new Response(JSON.stringify({ message: "Alle velden zijn verplicht" }), { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "Gebruiker bestaat al" }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, firstName, lastName, roleId: 1 },
  });

  return new Response(JSON.stringify(user), { status: 201 });
}
