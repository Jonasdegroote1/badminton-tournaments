import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(req, authOptions);

    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const body = await req.json();
    const { playerId, tournamentId } = body;

    console.log("📦 Ontvangen POST data:", body);

    const playerIdNum = Number(playerId);
    const tournamentIdNum = Number(tournamentId);

    if (!playerIdNum || !tournamentIdNum) {
      return new Response(
        JSON.stringify({ error: "playerId en tournamentId moeten geldige nummers zijn." }),
        { status: 400 }
      );
    }

    const existing = await prisma.playerTournament.findFirst({
      where: {
        playerId: playerIdNum,
        tournamentId: tournamentIdNum,
      },
    });

    if (existing) {
      return new Response(
        JSON.stringify({ error: "Speler is al toegevoegd aan dit toernooi." }),
        { status: 400 }
      );
    }

    const playerTournament = await prisma.playerTournament.create({
      data: {
        playerId: playerIdNum,
        tournamentId: tournamentIdNum,
      },
    });

    return new Response(JSON.stringify(playerTournament), { status: 201 });
  } catch (err) {
    console.error("❌ Fout in /api/player-tournament:", err);
    if (err.stack) console.error(err.stack);
    return new Response(
      JSON.stringify({ error: "Interne serverfout bij toevoegen speler." }),
      { status: 500 }
    );
  }
}
