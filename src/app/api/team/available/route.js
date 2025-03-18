import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tournamentId = searchParams.get("tournamentId");

  if (!tournamentId) {
    return new Response(
      JSON.stringify({ error: "tournamentId ontbreekt in query" }),
      { status: 400 }
    );
  }

  try {
    const teams = await prisma.team.findMany({
      where: {
        tournamentId: parseInt(tournamentId),
      },
      include: {
        player1: true,
        player2: true,
        strength: true,
        poule: true,
      },
    });

    return new Response(JSON.stringify(teams), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return new Response(JSON.stringify({ error: "Error fetching teams" }), {
      status: 500,
    });
  }
}
