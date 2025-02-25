import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const players = await prisma.player.findMany();

    console.log('Players in API:', players);

    return new Response(JSON.stringify(players), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    return new Response(JSON.stringify({ error: 'Error fetching players' }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  const { firstName, lastName, clubId } = await request.json();

  try {
    const player = await prisma.player.create({
      data: { firstName, lastName, clubId },
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