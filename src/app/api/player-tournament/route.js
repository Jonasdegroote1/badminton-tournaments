import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });

    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { playerId, tournamentId } = await request.json();

    const playerTournament = await prisma.playerTournament.create({
      data: {
        playerId,
        tournamentId,
      },
    });

    return new Response(JSON.stringify(playerTournament), { status: 201 });
  } catch (error) {
    console.error("❌ Fout in POST /api/player-tournament:", error);
    return new Response(
      JSON.stringify({ error: "Interne serverfout." }),
      { status: 500 }
    );
  }
}
