import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  console.log("✅ API call ontvangen");

  const session = await getServerSession({ req, ...authOptions });

  if (!session || session.user.roleId !== 1) {
    console.log("⛔️ Geen rechten om wedstrijden aan te maken");
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const body = await req.json();
  const { pouleId } = body;

  console.log("📌 Ontvangen body:", body);

  try {
    // ✅ Stap 1: Verwijder bestaande wedstrijden en teamkoppelingen in de poule
    console.log("🗑️ Verwijder bestaande matches en gekoppelde teams...");
    const existingMatches = await prisma.match.findMany({
      where: { pouleId: pouleId },
      select: { id: true },
    });

    const matchIds = existingMatches.map((match) => match.id);

    if (matchIds.length > 0) {
      await prisma.teamsInMatch.deleteMany({
        where: { matchId: { in: matchIds } },
      });

      await prisma.match.deleteMany({
        where: { pouleId: pouleId },
      });

      console.log("✅ Oude wedstrijden en teamkoppelingen verwijderd.");
    } else {
      console.log("ℹ️ Geen bestaande wedstrijden gevonden om te verwijderen.");
    }

    // ✅ Stap 2: Haal teams op uit de database
    const teams = await prisma.team.findMany({ where: { pouleId: pouleId } });
    console.log("📌 Gevonden teams:", teams);

    if (teams.length < 2) {
      console.log("⛔️ Niet genoeg teams om wedstrijden te genereren.");
      return new Response(
        JSON.stringify({ message: "Not enough teams to generate matches." }),
        { status: 400 }
      );
    }

    // ✅ Herschik de wedstrijden via round-robin met betere verdeling
    function roundRobinOrder(teams) {
      const matches = [];
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          matches.push([teams[i], teams[j]]);
        }
      }

      const result = [];
      const teamUsage = new Map(teams.map(team => [team.id, 0]));

      while (matches.length > 0) {
        matches.sort((a, b) => {
          const aScore = Math.max(teamUsage.get(a[0].id), teamUsage.get(a[1].id));
          const bScore = Math.max(teamUsage.get(b[0].id), teamUsage.get(b[1].id));
          return aScore - bScore;
        });

        const [teamA, teamB] = matches.shift();
        result.push([teamA, teamB]);
        teamUsage.set(teamA.id, result.length);
        teamUsage.set(teamB.id, result.length);
      }

      return result;
    }

    const orderedMatchPairs = roundRobinOrder(teams);

    let newMatches = [];

    for (const [teamA, teamB] of orderedMatchPairs) {
      console.log(`🔹 Maak match tussen team ${teamA.id} en ${teamB.id}`);

      const match = await prisma.match.create({
        data: {
          pouleId: pouleId,
          tournamentId: teamA.tournamentId,
          status: "Scheduled",
        },
      });

      if (!match) {
        console.log("⛔️ Fout bij het aanmaken van de wedstrijd.");
        continue;
      }

      await prisma.teamsInMatch.createMany({
        data: [
          { matchId: match.id, teamId: teamA.id },
          { matchId: match.id, teamId: teamB.id },
        ],
      });

      console.log(`✅ Teams ${teamA.id} en ${teamB.id} gekoppeld aan match ${match.id}`);

      newMatches.push(match);
    }

    console.log("✅ Alle wedstrijden succesvol gegenereerd!");

    return new Response(
      JSON.stringify({ message: "Matches regenerated successfully", matches: newMatches }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error tijdens het genereren van wedstrijden:", error);
    return new Response(
      JSON.stringify({ message: "Error generating matches", error: error.message }),
      { status: 500 }
    );
  }
}
