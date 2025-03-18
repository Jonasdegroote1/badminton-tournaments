import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const { prisma } = require("@/lib/prisma");

// /pages/api/teams.js
export async function GET(request) {
  console.log("API request received");

  const { searchParams } = new URL(request.url);
  const strengthId = searchParams.get('strengthId');
  const tournamentId = searchParams.get('tournamentId');

  try {
    const teams = await prisma.team.findMany({
      where: {
        strengthId: parseInt(strengthId),
        tournamentId: parseInt(tournamentId),
        pouleId: null,  // Alleen teams zonder poule
      },
      include: {
        player1: true,
        player2: true,
        strength: true,
        poule: true
      }
    });

    console.log("Teams fetched from database:", teams);

    return new Response(JSON.stringify(teams), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return new Response(JSON.stringify({ error: "Error fetching teams" }), {
      status: 500,
    });
  }
}


export async function POST(request) {
  
  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

  console.log("API request received");

  try {
    // Parse the request body correctly
    const { player1Id, player2Id, strengthId, poolId } = await request.json();

    // Create a new team entry in the database
    const team = await prisma.team.create({
      data: {
        player1Id,  // Store foreign key directly
        player2Id,
        strengthId,
        poolId
      }
    });

    console.log("Team created in database:", team);

    return new Response(JSON.stringify(team), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating team:", error);
    return new Response(JSON.stringify({ error: "Error creating team" }), {
      status: 500,
    });
  }
}


export async function PUT(request) {
  
  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

  console.log("API request received");

  const { id, player1Id, player2Id, strengthId, poolId } = await request.json();

  try {
    const team = await prisma.team.update({
      where: { id },
      data: {
        player1Id,
        player2Id,
        strengthId,
        poolId
      }
    });
    console.log("Team updated in database:", team);

    return new Response(JSON.stringify(team), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating team:", error);
    return new Response(JSON.stringify({ error: "Error updating team" }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  // Haal teamId op uit de URL queryparameter
  const url = new URL(request.url);
  const teamId = url.searchParams.get("teamId");

  if (!teamId || isNaN(teamId)) {
    return new Response(JSON.stringify({ error: "teamId is vereist en moet een geldig nummer zijn" }), { status: 400 });
  }

  // Verkrijg sessie en controleer rol
  const session = await getServerSession({ req: request, ...authOptions });

  if (!session) {
    return new Response(JSON.stringify({ error: "Geen geldige sessie" }), { status: 401 });
  }

  if (session.user.roleId !== 1) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  try {
    // Zoek het team in de database
    const team = await prisma.team.findUnique({
      where: { id: parseInt(teamId) },
    });

    if (!team) {
      return new Response(JSON.stringify({ error: "Team niet gevonden" }), { status: 404 });
    }

    // Verwijder het team uit de database
    const deletedTeam = await prisma.team.delete({
      where: { id: parseInt(teamId) },
    });

    return new Response(JSON.stringify({ message: "Team succesvol verwijderd", team: deletedTeam }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Fout bij het verwijderen van het team" }), {
      status: 500,
    });
  }
}
