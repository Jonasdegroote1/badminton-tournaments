// src/app/api/add-team-to-poule/route.js

import { prisma } from "@/lib/prisma"; // Zorg ervoor dat je de prisma-client correct importeert

export async function PUT(req) {
  try {
    const { teamId, pouleId } = await req.json(); // Haal teamId en pouleId uit de request body

    if (!teamId || !pouleId) {
      return new Response("Team ID en Poule ID zijn verplicht.", { status: 400 });
    }

    // Voeg het team toe aan de poule door de juiste koppeling in de database te maken
    const updatedTeam = await prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        pouleId: pouleId, // Koppel het team aan de poule
      },
    });

    // Retourneer het bijgewerkte team als response
    return new Response(JSON.stringify(updatedTeam), { status: 200 });
  } catch (error) {
    console.error("Error adding team to poule:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
