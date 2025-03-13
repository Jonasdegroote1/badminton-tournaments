// src/app/api/add-team-to-poule/route.js

import { prisma } from "@/lib/prisma"; // Zorg ervoor dat je de prisma-client correct importeert

export async function PUT(req) {
  try {
    // Ontvang de teamId en pouleId uit de request body
    const { teamId, pouleId } = await req.json();

    // Voeg het team toe aan de poule door de juiste koppeling in de database te maken
    const updatedTeam = await prisma.team.update({
      where: {
        id: teamId, // Zoek het team met het opgegeven ID
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
