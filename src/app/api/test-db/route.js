import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    await prisma.$connect();
    return new Response(JSON.stringify({ message: "Database connected!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Database connection failed" }), {
      status: 500,
    });
  }
}
