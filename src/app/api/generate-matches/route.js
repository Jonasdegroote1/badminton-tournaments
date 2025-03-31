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
    // ✅ Stap 1: Haal teams op uit de database
    const teams = await prisma.team.findMany({ where: { pouleId: pouleId } });
    console.log("📌 Gevonden teams:", teams);

    if (teams.length < 2) {
      console.log("⛔️ Niet genoeg teams om wedstrijden te genereren.");
      return new Response(JSON.stringify({ message: "Not enough teams to generate matches." }), { status: 400 });
    }

    let newMatches = [];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        console.log(`🔹 Maak match tussen team ${teams[i].id} en ${teams[j].id}`);

        // ✅ Stap 3: Maak de match aan
        const match = await prisma.match.create({
          data: {
            pouleId: pouleId,
            tournamentId: teams[i].tournamentId, // Haal dit uit het team
            status: "Scheduled",
          },
        });

        console.log("✅ Wedstrijd aangemaakt:", match);

        if (!match) {
          console.log("⛔️ Fout bij het aanmaken van de wedstrijd.");
          continue; // Sla deze iteratie over als de match niet aangemaakt is
        }

        // ✅ Stap 4: Koppel teams aan de match
        const teamsInMatch = await prisma.teamsInMatch.createMany({
          data: [
            { matchId: match.id, teamId: teams[i].id },
            { matchId: match.id, teamId: teams[j].id },
          ],
        });

        console.log("✅ Teams gekoppeld aan wedstrijd:", teamsInMatch);

        newMatches.push(match);
      }
    }

    console.log("✅ Alle wedstrijden succesvol gegenereerd!");

    return new Response(
      JSON.stringify({ message: "Matches generated successfully", matches: newMatches }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error tijdens het genereren van wedstrijden:", error);
    return new Response(JSON.stringify({ message: "Error generating matches", error: error.message }), { status: 500 });
  }
}
