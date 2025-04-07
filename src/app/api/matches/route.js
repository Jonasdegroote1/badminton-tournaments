const { prisma } = require("@/lib/prisma");

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pouleId = searchParams.get("pouleId");

  try {
    const matches = await prisma.match.findMany({
      where: {
        pouleId: parseInt(pouleId), // Zorg ervoor dat de pouleId goed wordt gefilterd
      },
      include: {
        teams: {
          include: {
            team: {
              include:{
                player1: true,
                player2: true,
              }
            }
          },
        },
        setResults: true,
      },
    });

    return new Response(JSON.stringify(matches), { status: 200 });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch matches" }), { status: 500 });
  }
}

export async function POST(request) {

  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

  try {
    const { courtId, poolId, team1Id, team2Id, status } = await request.json();

    // Maak de Match aan in de database
    const match = await prisma.match.create({
      data: {
        courtId,
        poolId,
        status: status || "scheduled", // Standaard status instellen
        teams: {
          create: [
            { team: { connect: { id: team1Id } } },
            { team: { connect: { id: team2Id } } },
          ],
        },
      },
      include: { teams: true }, // Zorg dat de teams worden teruggegeven
    });

    console.log("Match created:", match);

    return new Response(JSON.stringify(match), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating match:", error);

    return new Response(JSON.stringify({ error: "Error creating match" }), {
      status: 500,
    });
  }
}

export async function PUT(request) {

  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

  try {
    const { id, status } = await request.json();

    // Update de status van de match in de database
    const match = await prisma.match.update({
      where: { id },
      data: { status },
    });

    console.log("Match updated:", match);

    return new Response(JSON.stringify(match), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating match:", error);

    return new Response(JSON.stringify({ error: "Error updating match" }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {

  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }
    
  try {
    const { id } = await request.json();

    // Verwijder de match uit de database
    const match = await prisma.match.delete({ where: { id } });

    console.log("Match deleted:", match);

    return new Response(JSON.stringify(match), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting match:", error);

    return new Response(JSON.stringify({ error: "Error deleting match" }), {
      status: 500,
    });
  }
}
