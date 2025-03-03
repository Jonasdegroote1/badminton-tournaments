const { prisma } = require("@/lib/prisma");

export async function GET(request) {
  try {
    const standings = await prisma.standings.findMany();

    console.log('Standings in API:', standings);

    return new Response(JSON.stringify(standings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching standings:', error);
    return new Response(JSON.stringify({ error: 'Error fetching standings' }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    const { poolId, teamId, matchesPlayed, wins, losses, points, setsWon, setsLost } = await request.json();

    const standing = await prisma.standings.create({
      data: {
        poolId,
        teamId,
        matchesPlayed: matchesPlayed || 0, // Standaardwaarde 0 als niet meegegeven
        wins: wins || 0,
        losses: losses || 0,
        points: points || 0,
        setsWon: setsWon || 0,
        setsLost: setsLost || 0,
      },
    });

    console.log("Standing created in database:", standing);

    return new Response(JSON.stringify(standing), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating standing:", error);
    return new Response(JSON.stringify({ error: "Error creating standing" }), {
      status: 500,
    });
  }
}

export async function PUT(request) {
  try {
    const { id, poolId, teamId, matchesPlayed, wins, losses, points, setsWon, setsLost } = await request.json();

    const standing = await prisma.standings.update({
      where: { id },
      data: {
        poolId,
        teamId,
        matchesPlayed: matchesPlayed || 0, // Standaardwaarde 0 als niet meegegeven
        wins: wins || 0,
        losses: losses || 0,
        points: points || 0,
        setsWon: setsWon || 0,
        setsLost: setsLost || 0,
      },
    });

    console.log("Standing updated in database:", standing);

    return new Response(JSON.stringify(standing), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating standing:", error);
    return new Response(JSON.stringify({ error: "Error updating standing" }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    const standing = await prisma.standings.delete({
      where: { id },
    });

    console.log("Standing deleted from database:", standing);

    return new Response(JSON.stringify(standing), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting standing:", error);
    return new Response(JSON.stringify({ error: "Error deleting standing" }), {
      status: 500,
    });
  }
}
