import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma"; // Ensure your prisma instance is imported correctly

export async function GET(request) {
  console.log("API request received");

  // Iedereen kan tournaments ophalen
  try {
    const tournaments = await prisma.tournament.findMany();

    return new Response(JSON.stringify(tournaments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return new Response(JSON.stringify({ error: "Error fetching tournaments" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  // Get session from Next.js request
  const session = await getServerSession({ req: request, ...authOptions });

  if (!session || session.user.roleId !== 1) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const { name, date, session: tournamentSession } = await request.json(); // Fix variable name for the tournament session

  try {
    // Create the tournament in the database
    const tournament = await prisma.tournament.create({
      data: { name, date, session: tournamentSession },
    });
    console.log("Tournament created in database:", tournament);

    return new Response(JSON.stringify(tournament), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating tournament:", error);
    return new Response(JSON.stringify({ error: "Error creating tournament" }), {
      status: 500,
    });
  }
}