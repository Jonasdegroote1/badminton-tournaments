import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const { prisma } = require("@/lib/prisma");

// GET: Haalt sets op van een match
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get("matchId");

  if (!matchId) {
    return NextResponse.json({ error: "matchId is vereist" }, { status: 400 });
  }

  const sets = await prisma.setResult.findMany({
    where: { matchId: parseInt(matchId) },
    orderBy: { setNumber: "asc" },
  });

  return NextResponse.json(sets);
}

// POST: Maakt sets aan
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.roleId !== 1) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  try {
    const sets = await req.json();

    if (!Array.isArray(sets) || sets.length < 2 || sets.length > 3) {
      return new Response(JSON.stringify({ error: "Invalid number of sets. Must be 2 or 3 sets." }), { status: 400 });
    }

    const invalid = sets.some(
      (s) =>
        s.matchId == null ||
        s.setNumber == null ||
        s.team1Score < 0 ||
        s.team2Score < 0 ||
        s.setNumber < 1 ||
        s.setNumber > 3
    );

    if (invalid) {
      return new Response(JSON.stringify({ error: "Invalid set data" }), { status: 400 });
    }

    await prisma.setResult.createMany({
      data: sets.map(({ matchId, setNumber, team1Score, team2Score }) => ({
        matchId,
        setNumber,
        team1Score,
        team2Score,
      })),
      skipDuplicates: true,
    });

    const inserted = await prisma.setResult.findMany({
      where: { matchId: sets[0].matchId },
      orderBy: { setNumber: "asc" },
    });

    return new Response(JSON.stringify(inserted), {
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

// PUT: Update een bestaand setresultaat
export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.roleId !== 1) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  try {
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

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating result:", error);
    return new Response(JSON.stringify({ error: "Error updating result" }), {
      status: 500,
    });
  }
}

// DELETE: Verwijdert een setresultaat
export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.roleId !== 1) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id } = await req.json();

    const result = await prisma.setResult.delete({
      where: { id },
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting result:", error);
    return new Response(JSON.stringify({ error: "Error deleting result" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
