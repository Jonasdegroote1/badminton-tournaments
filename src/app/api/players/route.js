import { prisma } from "@/lib/prisma"; 
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tournamentId = parseInt(searchParams.get("tournamentId"));

  if (isNaN(tournamentId)) {
    return new Response(
      JSON.stringify({ error: "Ongeldig tournamentId" }),
      { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  try {
    const players = await prisma.player.findMany({
      where: {
        playerTournaments: {
          some: {
            tournamentId: tournamentId,
          },
        },
      },
      include: { 
        club: true // club info ophalen
      },
    });

    console.log(`Players for tournament ${tournamentId}:`, players);

    return new Response(JSON.stringify(players), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching players:", error);
    return new Response(JSON.stringify({ error: "Error fetching players" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  const session = await getServerSession({ req: request, ...authOptions });

  if (!session || session.user.roleId !== 1) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const { firstName, lastName, clubId, mail, phone } = await request.json();

  try {
    const player = await prisma.player.create({
      data: { firstName, lastName, clubId, mail, phone },
    });

    console.log('Player created in database:', player);

    return new Response(JSON.stringify(player), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating player:', error);
    return new Response(JSON.stringify({ error: 'Error creating player' }), {
      status: 500,
    });
  }
}

export async function PUT(request) {

  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }
  
  const { id, firstName, lastName, clubId } = await request.json();

  try {
    const player = await prisma.player.update({
      where: { id },
      data: { firstName, lastName, clubId },
    });

    console.log('Player updated in database:', player);

    return new Response(JSON.stringify(player), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating player:', error);
    return new Response(JSON.stringify({ error: 'Error updating player' }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {

  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

  const { id } = await request.json();

  try {
    const player = await prisma.player.delete({
      where: { id },
    });

    console.log('Player deleted from database:', player);

    return new Response(JSON.stringify(player), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting player:', error);
    return new Response(JSON.stringify({ error: 'Error deleting player' }), {
      status: 500,
    });
  }
}
