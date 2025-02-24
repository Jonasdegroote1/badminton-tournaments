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