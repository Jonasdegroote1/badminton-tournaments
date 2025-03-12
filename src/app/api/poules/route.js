// app/api/poules/route.js
import { prisma } from "@/lib/prisma";


export async function GET(req) {
  try {
    const url = new URL(req.url);
    const tournamentId = url.searchParams.get("tournamentId");

    if (!tournamentId) {
      return new Response(JSON.stringify({ error: "Geen tournamentId opgegeven" }), { status: 400 });
    }

    const poules = await prisma.poule.findMany({
      where: { tournamentId: parseInt(tournamentId) }, // Filter op het geselecteerde toernooi
      include: {
        teams: {
          include: {
            player1: true,
            player2: true,
            strength: true,
            poule: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(poules), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching poules:", error);
    return new Response(JSON.stringify({ error: "Error fetching poules" }), { status: 500 });
  }
}


// app/api/poules/route.js
export async function DELETE(req) {
  const { id } = await req.json(); // Gebruik await om de JSON-data van de body te verkrijgen

  try {
    const poule = await prisma.poule.delete({
      where: { id },
    });
    return new Response(JSON.stringify(poule), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting poule:", error);
    return new Response(JSON.stringify({ error: "Error deleting poule" }), {
      status: 500,
    });
  }
}
