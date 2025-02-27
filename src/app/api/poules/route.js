const { prisma } = require("@/lib/prisma");

export async function GET(request) {
  console.log("API request received");

  try {
    const poules = await prisma.pool.findMany({
      include: {
        teams: {
          include: {
            player1: true,
            player2: true,
            strength: true,
            pool: true
          }
        }
      }
    });
    console.log("Poules fetched from database:", poules);

    return new Response(JSON.stringify(poules), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching poules:", error);
    return new Response(JSON.stringify({ error: "Error fetching poules" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  console.log("API request received");

const { name, strengthId } = await request.json();
  try {
    const poule = await prisma.pool.create({
      data: {
        name,
        strengthId
      }
    });
    console.log("Poule created in database:", poule);

    return new Response(JSON.stringify(poule), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating poule:", error);
    return new Response(JSON.stringify({ error: "Error creating poule" }), {
      status: 500,
    });
  }
}

export async function PUT(request) {
  console.log("API request received");

  const { id, name, strengthId } = await request.json();

  try {
    const poule = await prisma.pool.update({
      where: { id },
      data: { 
        name,
        strengthId
      }
    });
    console.log("Poule updated in database:", poule);

    return new Response(JSON.stringify(poule), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating poule:", error);
    return new Response(JSON.stringify({ error: "Error updating poule" }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  console.log("API request received");

  const { id } = await request.json();

  try {
    const poule = await prisma.pool.delete({
      where: { id }
    });
    console.log("Poule deleted from database:", poule);

    return new Response(JSON.stringify(poule), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting poule:", error);
    return new Response(JSON.stringify({ error: "Error deleting poule" }), {
      status: 500,
    });
  }
}