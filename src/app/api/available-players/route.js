// src/app/api/available-players/route.js
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tournamentId = parseInt(searchParams.get("tournamentId"));

  console.log("tournamentId ontvangen:", tournamentId);

  if (isNaN(tournamentId)) {
    return new Response(JSON.stringify({ error: "Ongeldig tournamentId" }), { status: 400 });
  }

  try {
    const players = await prisma.player.findMany({
      where: {
        playerTournaments: {
          none: { tournamentId: tournamentId },
        },
      },
      include: { club: true },
    });

    console.log("Spelers gevonden:", players);

    return new Response(JSON.stringify(players), { status: 200 });
  } catch (error) {
    console.error("Prisma error detail:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching players", detail: error.message }),
      { status: 500 }
    );
  }
}
