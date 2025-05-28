import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(req, authOptions);

  if (!session || session.user.roleId !== 1) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  try {
    const body = await req.json();
    const { playerId, tournamentId } = body;

    if (!playerId || !tournamentId) {
      return new Response(JSON.stringify({ error: "Missing playerId or tournamentId" }), { status: 400 });
    }

    const playerTournament = await prisma.playerTournament.create({
      data: {
        playerId,
        tournamentId,
      },
    });

    return new Response(JSON.stringify(playerTournament), { status: 201 });
  } catch (error) {
    console.error("Fout bij toevoegen speler:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
