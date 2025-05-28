import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { playerId, tournamentId } = await req.json();

    const playerTournament = await prisma.playerTournament.create({
      data: {
        playerId,
        tournamentId,
      },
    });

    return new Response(JSON.stringify(playerTournament), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/player-tournament:", error);
    return new Response(
      JSON.stringify({ error: "Interne serverfout." }),
      { status: 500 }
    );
  }
}
