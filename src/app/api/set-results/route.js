const { prisma } = require("@/lib/prisma");

export async function GET(req, res) {
  try{
    const results = await prisma.setResult.findMany();
    console.log('Results in API:', results);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  catch(error){
    console.error('Error fetching results:', error);
    return new Response(JSON.stringify({ error: 'Error fetching results' }), {
      status: 500,
    });
  }
}

export async function POST(req, res) {
  try{
    const { matchId, setNumber, team1Score, team2Score } = await req.json();

    const result = await prisma.setResult.create({
      data: {
        matchId,
        setNumber,
        team1Score,
        team2Score,
      },
    });

    console.log("Result created in database:", result);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }
  catch(error){
    console.error("Error creating result:", error);
    return new Response(JSON.stringify({ error: "Error creating result" }), {
      status: 500,
    });
  }
}

export async function PUT(req, res) {
  try{
    const { id, matchId, setNumber, team1Score, team2Score } = await req.json();

    const result = await prisma.setResult.update({
      where: { id },
      data: {
        matchId,
        setNumber,
        team1Score,
        team2Score,
      },
    });

    console.log("Result updated in database:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  catch(error){
    console.error("Error updating result:", error);
    return new Response(JSON.stringify({ error: "Error updating result" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, res) {
  try{
    const { id } = await req.json();

    const result = await prisma.setResult.delete({
      where: { id },
    });

    console.log("Result deleted from database:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  catch(error){
    console.error("Error deleting result:", error);
    return new Response(JSON.stringify({ error: "Error deleting result" }), {
      status: 500,
    });
  }
}