const { prisma } = require("@/lib/prisma");

export async function GET(request) {
  console.log("API request received");

  try {
    const teams = await prisma.team.findMany({
      include: {
        player1: true,
        player2: true,
        strength: true,
        pool: true
      }}
    );
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
  
  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

  console.log("API request received");

  try {
    // Parse the request body correctly
    const { id } = await request.json(); 

    // Delete the team by ID
    const team = await prisma.team.delete({
      where: { id }
    });

    console.log("Team deleted from database:", team);

    return new Response(JSON.stringify({ message: "Team deleted successfully", team }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting team:", error);
    return new Response(JSON.stringify({ error: "Error deleting team" }), {
      status: 500,
    });
  }
}
