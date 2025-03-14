import { prisma } from "@/lib/prisma";

export async function PUT(req) {
  try {
    // Ontvang en parse de JSON-body
    const body = await req.json();
    const teamId = parseInt(body.teamId, 10);
    const pouleId = parseInt(body.pouleId, 10);

    // Controleer of de parsing gelukt is
    if (isNaN(teamId) || isNaN(pouleId)) {
      return new Response(JSON.stringify({ error: "Invalid teamId or pouleId" }), { status: 400 });
    }

    // Update het team in de database
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: { pouleId: pouleId },
    });

    return new Response(JSON.stringify(updatedTeam), { status: 200 });
  } catch (error) {
    console.error("Error adding team to poule:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
