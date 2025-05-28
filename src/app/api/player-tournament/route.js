import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(req, authOptions);

    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Geen toegang" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { playerId, tournamentId } = body;

    if (!playerId || !tournamentId) {
      return new Response(JSON.stringify({ error: "playerId en tournamentId zijn vereist." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const created = await prisma.playerTournament.create({
      data: {
        playerId,
        tournamentId,
      },
    });

    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Interne serverfout:", error);

    return new Response(JSON.stringify({ error: "Interne serverfout" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
