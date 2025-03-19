import { prisma } from "@/lib/prisma"; 
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function DELETE(req) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session || session.user.roleId !== 1) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const playerId = parseInt(searchParams.get("playerId"));
  const tournamentId = parseInt(searchParams.get("tournamentId"));

  if (!playerId || !tournamentId) {
    return new Response(JSON.stringify({ error: "playerId en tournamentId vereist" }), {
      status: 400,
    });
  }

  try {
    await prisma.playerTournament.deleteMany({
      where: { playerId, tournamentId }
    });

    return new Response(JSON.stringify({ message: "Relatie succesvol verwijderd" }), { status: 200 });
  } catch (error) {
    console.error("Error bij verwijderen relatie:", error);
    return new Response(JSON.stringify({ error: "Error bij verwijderen relatie" }), { status: 500 });
  }
}
