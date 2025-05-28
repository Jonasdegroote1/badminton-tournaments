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

export async function DELETE(request) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });

    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const playerId = parseInt(searchParams.get("playerId"));
    const tournamentId = parseInt(searchParams.get("tournamentId"));

    if (!playerId || !tournamentId) {
      return new Response(JSON.stringify({ error: "playerId en tournamentId zijn verplicht." }), {
        status: 400,
      });
    }

    await prisma.playerTournament.deleteMany({
      where: {
        playerId,
        tournamentId,
      },
    });

    return new Response(JSON.stringify({ message: "Speler succesvol verwijderd uit toernooi." }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Fout in DELETE /api/player-tournament:", error);
    return new Response(
      JSON.stringify({ error: "Interne serverfout bij verwijderen speler." }),
      { status: 500 }
    );
  }
}
