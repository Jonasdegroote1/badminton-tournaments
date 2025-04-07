import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

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

export async function POST(req) {
  const session = await getServerSession({ req, ...authOptions });

  // Controleer of de gebruiker de juiste rol heeft
  if (!session || session.user.roleId !== 1) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  try {
    const sets = await req.json();

    // Controleer of sets een array is en of het aantal sets 2 of 3 is
    if (!Array.isArray(sets) || sets.length < 2 || sets.length > 3) {
      return new Response(JSON.stringify({ error: "Invalid number of sets. Must be 2 or 3 sets." }), { status: 400 });
    }

    // Validatie op negatieve scores en ontbrekende gegevens
    const invalid = sets.some(
      (s) =>
        s.matchId == null ||
        s.setNumber == null ||
        s.team1Score < 0 ||
        s.team2Score < 0 ||
        s.setNumber < 1 || s.setNumber > 3 // Zorg ervoor dat setNumber tussen 1 en 3 ligt
    );
    if (invalid) {
      return new Response(JSON.stringify({ error: "Invalid set data" }), { status: 400 });
    }

    // Maak de setresultaten aan in de database
    const result = await prisma.setResult.createMany({
      data: sets.map(({ matchId, setNumber, team1Score, team2Score }) => ({
        matchId,
        setNumber,
        team1Score,
        team2Score,
      })),
    });

    console.log("SetResults created:", result);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating results:", error);
    return new Response(JSON.stringify({ error: "Error creating results" }), {
      status: 500,
    });
  }
}

export async function PUT(req, res) {
  
  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

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
  
  const session = await getServerSession({ req: request, ...authOptions });
  
    if (!session || session.user.roleId !== 1) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

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