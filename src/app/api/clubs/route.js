import { prisma } from "@/lib/prisma";

export async function GET(request) {
  console.log("API request received"); // Debug: Log als de API wordt aangeroepen

  try {
    const clubs = await prisma.club.findMany();
    console.log("Clubs fetched from database:", clubs); // Debug: Log de opgehaalde clubs

    return new Response(JSON.stringify(clubs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return new Response(JSON.stringify({ error: "Error fetching clubs" }), {
      status: 500,
    });
  }
}
