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

    // 👇 Log de ontvangen data
    console.log("📦 Ontvangen POST data:", { playerId, tournamentId });

    if (!playerId || !tournamentId) {
      return new Response(JSON.stringify({ error: "playerId en tournamentId zijn verplicht." }), {
        status: 400,
      });
    }

    // Controleer of speler al gekoppeld is
    const existing = await prisma.playerTournament.findFirst({
      where: {
        playerId,
        tournamentId,
      },
    });

    if (existing) {
      return new Response(JSON.stringify({ error: "Speler is al toegevoegd aan dit toernooi." }), {
        status: 400,
      });
    }

    const playerTournament = await prisma.playerTournament.create({
      data: {
        playerId,
        tournamentId,
      },
    });

    return new Response(JSON.stringify(playerTournament), { status: 201 });
  } catch (err) {
    console.error("❌ Fout in /api/player-tournament:", err);
    return new Response(
      JSON.stringify({ error: "Interne serverfout bij toevoegen speler." }),
      { status: 500 }
    );
  }
}
