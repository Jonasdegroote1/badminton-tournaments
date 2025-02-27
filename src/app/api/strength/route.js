const { prisma } = require("@/lib/prisma");

export async function GET(request) {
  console.log("API request received");

  try {
    const strengths = await prisma.strength.findMany();
    console.log("Strengths fetched from database:", strengths);

    return new Response(JSON.stringify(strengths), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching strengths:", error);
    return new Response(JSON.stringify({ error: "Error fetching strengths" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  console.log("API request received");

  const { name } = await request.json();

  try {
    const strength = await prisma.strength.create({
      data: {
        name
      }
    });
    console.log("Strength created in database:", strength);

    return new Response(JSON.stringify(strength), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating strength:", error);
    return new Response(JSON.stringify({ error: "Error creating strength" }), {
      status: 500,
    });
  }
}

export async function PUT(request) {
  console.log("API request received");

  const { id, name } = await request.json();

  try {
    const strength = await prisma.strength.update({
      where: { id },
      data: { name }
    });
    console.log("Strength updated in database:", strength);

    return new Response(JSON.stringify(strength), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating strength:", error);
    return new Response(JSON.stringify({ error: "Error updating strength" }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  console.log("API request received");

  const { id } = await request.json();

  try {
    const strength = await prisma.strength.delete({
      where: { id }
    });
    console.log("Strength deleted from database:", strength);

    return new Response(JSON.stringify(strength), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting strength:", error);
    return new Response(JSON.stringify({ error: "Error deleting strength" }), {
      status: 500,
    });
  }
}