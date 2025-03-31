import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(req, authOptions);
  
  if (!session || session.user.roleId !== 1) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const body = await req.json();
  const { poolId } = body;

  try {
    const teams = await prisma.team.findMany({ where: { poolId } });

    if (teams.length < 2) {
      return new Response(JSON.stringify({ message: "Not enough teams to generate matches." }), { status: 400 });
    }

    let matches = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          poolId,
          team1Id: teams[i].id,
          team2Id: teams[j].id,
          status: "Scheduled",
        });
      }
    }

    const existingMatches = await prisma.match.findMany({
      where: {
        poolId,
        OR: matches.map((match) => ({
          AND: [
            { team1Id: match.team1Id },
            { team2Id: match.team2Id },
          ],
        })),
      },
    });

    const newMatches = matches.filter(
      (match) =>
        !existingMatches.some(
          (existing) =>
            (existing.team1Id === match.team1Id && existing.team2Id === match.team2Id) ||
            (existing.team1Id === match.team2Id && existing.team2Id === match.team1Id)
        )
    );

    if (newMatches.length > 0) {
      await prisma.match.createMany({ data: newMatches });
    }

    return new Response(JSON.stringify({ message: "Matches generated successfully", matches: newMatches }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error generating matches", error }), { status: 500 });
  }
}
